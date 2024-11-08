import ollama, { Ollama } from "ollama";
import fs from 'fs';

export default class AI {
  public system: string;
  public model: string;
  private context: number[];

  constructor(ollamaModel: string, responseInstructionFileLocation?: string) {
    const personalityInstructions = fs.readFileSync(responseInstructionFileLocation ? responseInstructionFileLocation : 'myrelle-model.txt', 'utf-8');
    const commandExecInstructions = fs.readFileSync('command-execution-model.txt', 'utf-8');
    const history = fs.readFileSync('history.context', 'utf-8');
    // fs.rea

    this.system = personalityInstructions + ' ' + commandExecInstructions;
    this.model = ollamaModel;
    this.context = history ? JSON.parse(history) : [];
  }

  public runChat = async (prompt: string) => {
    return new Promise<string>((resolve) => {
      ollama.generate({
        model: this.model,
        system: this.system,
        prompt,
        context: this.context
      }).then((response) => {
        this.context = response.context;
        resolve(response.response);
      });
    });
  }

  public saveContext = async () => {
    return new Promise<void>((resolve) => {
      fs.writeFileSync('history.context', '[' + this.context.toString() + ']');
      resolve();
    })
  }
}
