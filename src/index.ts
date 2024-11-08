import { speak } from "./speaker.js";
import AI from "./tools/AI.js";
import Listener from "./tools/Listener.js";
import Speaker from "./tools/Speaker.js";

// const l = new Listener(3000, 'vosk-model-small-en-us-0.15');
const ai = new AI('llama3.2');
const sp = new Speaker();

async function keepAlive() {
  // console.log('\n\nStarted')
  // await l.listenForActivationWord();
  // console.log('Activated');
  // l.listenForInput().then((e) => {
  //   console.log(e);
  //   // l.closeListener();
  //   keepAlive();
  // });

  const r = await ai.runChat('open nautilus and then open firefox');
  const arr = sp.constructPromptForEvaluation(r);
  await sp.convertTextToAudio(arr);
}

keepAlive();