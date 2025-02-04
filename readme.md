# Python Language Client (Default PyRight)
  Custom Your Python Language Server, This configurate default setting is **Pyright**

  **Please Support Me** 🥺

  <a href="https://trakteer.id/qiubyzhukhi/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

## Acode Plugin Requiriment Installed
  1. [Acode Language Client](https://acode.app/plugin/acode.language.client) 
  2. Follow the instructions there to run the Language Server.
  3. you can watch my **VIDEO TUTORIAL** to install *Acode Language Client* [Click Here](https://youtu.be/Rc-jvCWHG9E?si=VuY0VCMD2jnn3ptE)
  

## Setup Language server
  - If you want uses Jedi Language server
    ```bash
     pip install -U jedi-language-server
    ```
    settings.json
    ```json
        "acode.python.custom": {
        "serverPath": "jedi-language-server",
        "arguments": []
        },
    ```

  - if you want uses Pyright
    ```bash
    pip install pyright
    ```
    settings.json
    ```json
        "acode.python.custom": {
        "serverPath": "python",
        "arguments": [
          "-m","pyright.langserver", "--stdio"
        ]
      },
    ```
    [Pyright Video Preview](https://youtu.be/kIFx0yWQbz0?si=PsNRUjgQXIqwmAKJ)

## Update Info
 - Sertings for Pyright tutorial
 - Settings menu fix 
 - Readme.md
 - Gear Icon for Settings only path & argumen

Jedi Repo: [Jedi](https://github.com/pappasam/jedi-language-server)