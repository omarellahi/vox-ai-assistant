import AI from "./tools/AI.js";
import Listener from "./tools/Listener.js";
import Speaker from "./tools/Speaker.js";

const li = new Listener(3000, 'vosk-model-small-en-us-0.15', 'hello');
const ai = new AI('llama3.2');
const sp = new Speaker();

async function keepAlive() {
  sp.alertSound(1);
  console.log('\n\nStarted');
  await li.listenForActivationWord();
  console.log('Activated');
  sp.alertSound(1);
  const input = await li.listenForInput();
  sp.alertSound(2);
  console.log('Running AI');
  const aiResponse = await ai.runChat(input);
  const arr = sp.constructPromptForEvaluation(aiResponse);
  sp.convertTextToAudio(arr).then(keepAlive);
}

keepAlive();

process.on('SIGINT', () => {
  li.close();
  ai.saveContext().then(() => {
    sp.alertSound(2);
    process.exit();
  })
});
