import gTTS from 'gtts';
import player from 'play-sound';
import fs from 'fs';
import { exec } from 'child_process';

export const speak = (text: string) => {
  let prompt = text;
  const regexForCommand = /<<exec: `([^`]+)`>>/
  const command = text.match(regexForCommand);
  if (command) {
    if (command[1].includes('echo')) {
      exec(`gnome-terminal -- bash -c '${command[1]}; exec $SHELL'`);
    } else {
      exec(command[1]);
    }
    prompt = text.replace(regexForCommand, '');
  }

  const gtts = new gTTS(prompt, 'en');

  const audioFilePath = 'temp_voice.mp3';

  gtts.save(audioFilePath, function (err: string | undefined) {
    if (err) {
      throw new Error(err);
    }
    console.log("Text to speech converted!");
    const play = player({ player: 'mpg123' });
    play.play(audioFilePath, function (playErr: any) {
      if (playErr) throw new Error(playErr);
      console.log("Audio playback complete!");
      fs.unlink(audioFilePath, (unlinkErr: any) => {
        if (unlinkErr) throw new Error(unlinkErr);
        console.log("Temporary audio file deleted.");
      });
    });
  });
}
