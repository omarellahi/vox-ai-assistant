import gTTS from 'gtts';
import ps from 'play-sound';
import fs from 'fs';
import { exec } from 'child_process';

export default class Speaker {
  private commandsArr: string[];
  private regexForCommands: RegExp;
  private player: any;

  constructor() {
    this.player = ps({ player: 'mpg123' });
    this.commandsArr = [];
    this.regexForCommands = /<<exec: "([^"]+)">>/g;
  }

  public constructPromptForEvaluation = (prompt: string): string[] => {
    const finalisedPromptArr: string[] = [];
    const splitArr = prompt.split('.');
    for (const value of splitArr) {
      let text = value;
      const commands = [...text.matchAll(this.regexForCommands)].map(match => match[1]);
      if (commands && commands.length) {
        this.commandsArr = this.commandsArr.concat(commands);
        text = text.replace(this.regexForCommands, '');
      }
      if (text.length && text !== '\n') {
        finalisedPromptArr.push(text);
      }
    }
    console.log(finalisedPromptArr);
    return finalisedPromptArr;
  }

  public convertTextToAudio = async (evaluatedResponse: string[]) => {
    return new Promise<void>(async (resolve) => {
      const filePathArr: string[] = [];

      const audioPromises = evaluatedResponse.map((text, index) => {
        const gtts = new gTTS(text, 'en');
        const audioFilePath = `temp_voice_${index}.mp3`;
        filePathArr.push(audioFilePath);

        return new Promise<string>((resolve) => {
          gtts.save(audioFilePath, () => resolve(audioFilePath));
        });
      });

      const audioFilePaths = await Promise.all(audioPromises);

      for (const filePath of audioFilePaths) {
        await this.playAudio(filePath);
      }
  
      resolve();
    });
  }
  

  private playAudio = async (filePath: string) => {
    await new Promise<void>((resolve) => {
      this.player.play(filePath, () => {
        fs.unlink(filePath, () => {
          console.log(`${filePath} deleted`);
          resolve();
        });
      })
    });
  }
}
