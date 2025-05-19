import Mic from 'node-mic';
import path from 'path';
import { Model, Recognizer } from 'vosk-koffi';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default class Listener {
  private micInstance: any;
  private micInputStream: any;
  private model: Model;
  private recognizer: Recognizer<any>;
  public activationWord: string;

  private audioTimeout: number;
  public isListeningActive: boolean;

  constructor(audioTimeout: number, voskModel: string, activationWord: string) {
    this.micInstance = new Mic({
      rate: 16000,
      channels: 1
    });

  
    this.micInputStream = this.micInstance.getAudioStream();
    this.micInputStream.on('end', () => {
      console.log('Microphone stream ended.');
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const modelPath = path.join(__dirname, '../../models', voskModel);
    this.model = new Model(modelPath);

    this.recognizer = new Recognizer({ model: this.model, sampleRate: 16000 });
    this.activationWord = activationWord;

    this.audioTimeout = audioTimeout;
    this.isListeningActive = true;

    this.micInstance.start();
  }

  public listenForActivationWord = () => {
    this.micInputStream.removeAllListeners('data');
    return new Promise<void>((resolve) => {
      this.micInputStream.on('data', (data: Buffer) => {
        if (this.recognizer.acceptWaveform(data)) {
          const result = this.recognizer.partialResult().partial;
          if (result === this.activationWord && this.isListeningActive) {
            this.recognizer.reset();
            this.micInputStream.removeAllListeners('data');
            resolve();
          } else {
            console.log(result);
            this.recognizer.reset();
          }
        }
      });
    });
  }

  public listenForInput = async (): Promise<string> => {
    this.micInputStream.removeAllListeners('data');
    return new Promise<string>((resolve) => {
      const statements: string[] = [];

      let timer: NodeJS.Timeout | null;
      const resetTimer = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          this.micInputStream.removeAllListeners('data');
          resolve(statements.join('\n'));
        }, this.audioTimeout);
      }
  
  
      this.micInputStream.on('data', (data: Buffer) => {
        if (this.recognizer.acceptWaveform(data)) {
          const result = this.recognizer.partialResult().partial;
          if (result.trim().length) {
            statements.push(result);
            console.log(result);
            this.recognizer.reset();
            resetTimer();
          }
        }
      });
    });
  }

  public close = () => {
    console.log('Stopping recognition...');
    this.micInstance.stop();
    this.recognizer.free();
    this.model.free();
  }
}
