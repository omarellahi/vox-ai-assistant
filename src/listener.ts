import mic from 'mic';
import Vosk from 'vosk';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runChat } from './ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modelPath = path.join(__dirname, '../models', 'vosk-model-small-en-us-0.15');
const model = new Vosk.Model(modelPath);
const recognizer = new Vosk.Recognizer({ model: model, sampleRate: 16000 });

const statementsSaid: string[] = [];

const micInstance = mic({
  rate: '16000',
  channels: '1',
  exitOnSilence: 5,
  device: 'plughw:0,0',
});

const micInputStream = micInstance.getAudioStream();

let timeout: string | number | NodeJS.Timeout | undefined;

const resetTimeout = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('Timeout reached! Stopping recognition...');
    micInstance.stop();
    recognizer.free();
    model.free();

    runChat(statementsSaid[0]);
  }, 3000);
};

micInputStream.on('data', (data: Buffer) => {
  if (recognizer.acceptWaveform(data)) {
    const result = recognizer.result().text;
    if (result.length) {
      statementsSaid.push(result);
      console.log(result);
      recognizer.reset();
      resetTimeout();
    }
  }
});

micInputStream.on('error', (err: Error) => {
  console.error('Microphone error:', err);
});

micInputStream.on('end', () => {
  console.log('Microphone stream ended.');
});

micInstance.start();
console.log('Microphone is active. Listening for speech...');

process.on('SIGINT', () => {
  console.log(statementsSaid);
  console.log('Stopping recognition...');
  micInstance.stop();
  recognizer.free();
  model.free();
  process.exit();
});
