import Mic from 'mic';
import Vosk from 'vosk';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default class Listener {
  private micInstance: any;
  private micInputStream: any;
  private model: Vosk.Model;
  private recognizer: Vosk.Recognizer<any>;

  private audioTimeout: number;
  public isListeningActive: boolean;

  constructor(audioTimeout: number, voskModel: string) {
    this.micInstance = Mic({
      rate: '16000',
      channels: '1',
      exitOnSilence: 5,
      device: 'plughw:0,0',
    })
    this.micInputStream = this.micInstance.getAudioStream();
    this.micInputStream.on('end', () => {
      console.log('Microphone stream ended.');
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const modelPath = path.join(__dirname, '../../models', voskModel);
    this.model = new Vosk.Model(modelPath);

    this.recognizer = new Vosk.Recognizer({ model: this.model, sampleRate: 16000 });

    this.audioTimeout = audioTimeout;
    this.isListeningActive = true;

    this.micInstance.start();
  }

  public listenForActivationWord = () => {
    this.micInputStream.removeAllListeners('data');
    return new Promise<void>((resolve) => {
      this.micInputStream.on('data', (data: Buffer) => {
        if (this.recognizer.acceptWaveform(data)) {
          const result = this.recognizer.result().text;
          if (result === 'activate' && this.isListeningActive) {
            this.recognizer.reset();
            resolve();
          } else {
            console.log(result);
            this.recognizer.reset();
          }
        }
      });
    });
  }

  public listenForInput = async () => {
    this.micInputStream.removeAllListeners('data');
    return new Promise<string>((resolve) => {
      const statements: string[] = [];

      let timer: NodeJS.Timeout;
      const resetTimer = () => {
        timer = setTimeout(() => {
          resolve(statements.join());
        }, this.audioTimeout);
      }
  
  
      this.micInputStream.on('data', (data: Buffer) => {
        if (this.recognizer.acceptWaveform(data)) {
          const result = this.recognizer.result().text;
          if (result.length) {
            statements.push(result);
            this.recognizer.reset();
            resetTimer();
          }
        }
      });
    });
  }

  public closeListener = () => {
    console.log('Stopping recognition...');
    this.micInstance.stop();
    this.recognizer.free();
    this.model.free();
  }
}
