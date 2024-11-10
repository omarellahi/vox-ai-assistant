import gTTS from 'gtts';
import ps from 'play-sound';
import fs from 'fs';
import { exec } from 'child_process';

export default class Speaker {
  private commandsArr: string[];
  private regexForCommands: RegExp;
  private regexForWebsites: RegExp;
  private player: any;

  constructor() {
    this.player = ps({ player: 'mpg123' });
    this.commandsArr = [];
    this.regexForCommands = /<<exec: "([^"]+)">>/g;
    this.regexForWebsites = /^"https?:\/\/[^\s/$.?#].[^\s]*"$/;
  }

  public alertSound = (v: number) => {
    if (v === 1) {
      exec('canberra-gtk-play -i dialog-warning');
    } else if (v === 2) {
      exec('canberra-gtk-play -i bell');
    }
  }

  public constructPromptForEvaluation = (prompt: string): string[] => {
    const finalisedPromptArr: string[] = [];
    const splitArr = prompt.split(/(?<=\S[.!?])\s+(?=\S)/);
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
    return finalisedPromptArr;
  }

  public convertTextToAudio = async (evaluatedResponse: string[]) => {
    return new Promise<void>(async (resolve) => {
      const filePathArr: string[] = [];

      const audioPromises = evaluatedResponse.map((text, index) => {
        const gtts = new gTTS(text, 'en');
        const audioFilePath = `temp_voice_${index}.mp3`;
        filePathArr.push(audioFilePath);

        console.log(text);
        return new Promise<string>((resolve) => {
          gtts.save(audioFilePath, () => resolve(audioFilePath));
        });
      });

      const audioFilePaths = await Promise.all(audioPromises);

      for (const filePath of audioFilePaths) {
        await this.playAudio(filePath);
        this.execCommands();
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

  private execCommands = () => {
    for (const command of this.commandsArr) {
      console.log(command);
      if (command.includes('firefox') && !this.regexForWebsites.test((command.match(/^(\S+)\s+"?(.+)"?$/) as unknown as string)[2])) {
        const searchVal = (command.match(/^(\S+)\s+"?(.+)"?$/) as unknown as string)[2].replace(/^"|"$/g, '').split(' ').join('+');
        exec(`gnome-terminal -- bash -c 'firefox "https://search.brave.com/search?q=${searchVal}"; exec $SHELL'`);
      } else {
        exec(`gnome-terminal -- bash -c '${command}; exec $SHELL'`);
      }
    }
    this.commandsArr = [];
  }
}
