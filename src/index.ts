import AI from "./tools/AI.js";
import Listener from "./tools/Listener.js";

// const l = new Listener(3000, 'vosk-model-small-en-us-0.15');
const ai = new AI('neural-chat');

async function keepAlive() {
  // console.log('\n\nStarted')
  // await l.listenForActivationWord();
  // console.log('Activated');
  // l.listenForInput().then((e) => {
  //   console.log(e);
  //   // l.closeListener();
  //   keepAlive();
  // });
}

keepAlive();