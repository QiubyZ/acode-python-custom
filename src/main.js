import plugin from "../plugin.json";
let AppSettings = acode.require("settings");

class AcodePlugin {
  constructor() {
    this.name_language_type = "python"
    this.languageserver = "python"
    this.standart_args = ["-m", "pyright.langserver", "--stdio"]
    this.initializeOptions = {
      initializationOptions: {
        completion: {
          disableSnippets: false,
          resolveEagerly: false,
          ignorePatterns: []
        },
        diagnostics: {
          enable: true,
          didOpen: true,
          didChange: true,
          didSave: true
        },
      }
    }
  }

  async init() {
    let acodeLanguageClient = acode.require("acode-language-client");
    if (acodeLanguageClient) {
      await this.setupLanguageClient(acodeLanguageClient);
    } else {
      window.addEventListener("plugin.install", ({ detail }) => {
        if (detail.name === "acode-language-client") {
          acodeLanguageClient = acode.require("acode-language-client");
          this.setupLanguageClient(acodeLanguageClient);
        }
      });
    }
  }
  get settings() {
    // UPDATE SETTING SAAT RESTART ACODE
    if (!window.acode) return this.defaultSettings;
    let value = AppSettings.value[plugin.id];
    if (!value) {
      //Menjadikan Method defaultSettings sebagai nilai Default
      value = AppSettings.value[plugin.id] = this.defaultSettings;
      AppSettings.update();
    }
    return value;
  }
  get settingsMenuLayout() {
    return {
      list: [
        {
          index: 0,
          key: "serverPath",
          promptType: "text",
          prompt: "Change the serverPath before running.",
          text: "Python Executable File Path",
          value: this.settings.serverPath,
        },
        {
          index: 1,
          key: "arguments",
          promptType: "text",
          info: "For multiple arguments, please use comma ','<br>Example: --stdio, -v, -vv",
          prompt: "Argument Of Language Server",
          text: "Python Argument",
          value: this.settings.arguments.join(", ")
        },
      ],

      cb: (key, value) => {
        switch (key) {
          case 'arguments':
            value = value ? value.split(",").map(item => item.trim()) : [];
            break;
        }
        AppSettings.value[plugin.id][key] = value;
        AppSettings.update();
      },
    };
  }

  get defaultSettings() {
    return {
      serverPath: this.languageserver,
      arguments: this.standart_args,
      languageClientConfig: this.initializeOptions
    };
  }

  async setupLanguageClient(acodeLanguageClient) {
    let socket = acodeLanguageClient.getSocketForCommand(
      this.settings.serverPath,
      this.settings.arguments,
    );


    let PythonClient = new acodeLanguageClient.LanguageClient({
      type: "socket",
      socket,
      features: {completion: true, completionResolve: true, diagnostics: true, format: true, hover: true, documentHighlight: true, signatureHelp: true},
      
      initializationOptions: this.settings.languageClientConfig.initializationOptions
    });
      acodeLanguageClient.registerService(this.name_language_type, PythonClient);

    
    let handler = () => {
        PythonClient.connection.onNotification("$/logTrace", ({ params }) => {
        console.log("ShowMessage: " + params.message)
      });
      PythonClient.connection.onNotification("workspace/configuration", params => {
        const deb = "Initilizing Progress " + this.languageserver
        console.log(deb + `${params.message}`)

      });
      PythonClient.connection.onRequest("window/workDoneProgress/create", params => {
        const deb = "Initializing WorkDone Progress " + this.languageserver
        console.log(deb + `${params.message}`)

      });
    }
    socket.addEventListener("open", () => {
      if (PythonClient.isInitialized) handler();
      else PythonClient.requestsQueue.push(() => handler());
      console.log(`OPEN CONNECTION ${this.languageserver}`)

    });
    acode.registerFormatter(plugin.name, ["python"], () =>
      acodeLanguageClient.format(),
    );

  }
  infoUI(pesan) {
    window.toast(pesan, 2000)
  }

  async destroy() {
    if (AppSettings.value[plugin.id]) {
      delete AppSettings.value[plugin.id];
      AppSettings.update();
    }
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
    acodePlugin.settingsMenuLayout,
  );

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });

}
