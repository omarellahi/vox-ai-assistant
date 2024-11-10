# AI Voice Assistant with Personality

This project is an AI-powered voice assistant that allows you to run commands, open apps, or ask for information—all while interacting with a personality! 

## Requirements

Before you get started, make sure you have the following:

1. **mpg123** (for audio playback):
   - Install it with the following command (on fedora):
   ```bash
   sudo dnf install mpg123
   ```

2. **Ollama** (for natural language processing):
   - You’ll need this dependency installed to handle advanced interactions. Make sure to follow the installation instructions on [Ollama’s official site](https://ollama.com/) for your platform.

3. **Vosk Language Models** (for offline speech recognition):
   - Download a Vosk language model and place it in the `models/` directory in the project root.
   - For instructions on downloading models, visit the [Vosk models page](https://alphacephei.com/vosk/models).

4. **Internet Connection** (for Text-to-Speech):
   - TTS functionality requires an internet connection, so make sure you have access to the web for speech synthesis.

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

---

Enjoy your new AI voice assistant with a personality! For bugs or feature requests, feel free to open an issue.
