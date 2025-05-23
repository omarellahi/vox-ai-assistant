# AI Voice Assistant with Personality

This project is an AI-powered voice assistant that allows you to run commands, open apps, or ask for information—all while interacting with a personality!

## Requirements

Before you get started, make sure you have the following:

1. **mpg123** (for audio playback):
   - On Rhel, Fedora based distros:
   ```bash
   sudo dnf install mpg123
   ```
   - On Debian based distros:
   ```bash
   sudo apt update
   sudo apt install mpg123
   ```
   - Using homebrew (for Macos):
   ```bash
   brew install mpg123
   ```

2. **Ollama** (for natural language processing):
   - You’ll need this dependency installed to handle advanced interactions. Make sure to follow the installation instructions on [Ollama’s official site](https://ollama.com/) for your platform.

3. **Vosk Language Models** (for offline speech recognition):
   - Download a Vosk language model and place it in the `models/` directory in the project root. Make sure to update `const li = new Listener(timeout, model name, activation word);` function in `index.ts`.
   - For instructions on downloading models, visit the [Vosk models page](https://alphacephei.com/vosk/models).

4. **Internet Connection** (for Text-to-Speech):
   - TTS functionality requires an internet connection (I haven't found a satisfactory offline TTS, so this will have to do for now).

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:omarellahi/vox-ai-assistant.git
   cd vox-ai-assistant
   ```

2. Install required dependencies:
   - Make sure you have **mpg123** installed (as shown above).
   - Install Ollama according to the official documentation.

3. Download the Vosk language model and place it in the `models/` directory.

## Usage

- To run the voice assistant:
  ```bash
  npm build //run this to transpile ts to js
  node .
  ```

- The assistant will wait for your voice commands. You can ask it to run commands, open apps, or give you information.

## Notes

- The assistant’s personality adds a fun twist to your interactions.
- Make sure the **mpg123** package is installed to play audio responses.
- **Ollama** is necessary for processing advanced commands, so ensure it is properly set up.
- **Vosk** works offline for speech recognition, but TTS (Text-to-Speech) requires an internet connection.
- Requires you to create `history.context` file in the root of the project.

##

Enjoy your new AI voice assistant with a personality! 
As of now it has only been tested on my personal machine with Fedora. So please feel free to open an Issue or create PR for feature or bug fixes.
I would appreciate it!
