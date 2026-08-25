# 🐋 Deepseek Harness Containerized 🐋
Simple Linux Bash script to install & run [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) with isolated workspaces through Docker.  
Prevent DSH from accessing unwanted directories by whitelisting specific volumes.  

> [!CAUTION]
> Currently work in progress.  
> I'm actively improving the created dsh binary with more options and compose.yml volume bind access control

> [!IMPORTANT]
> To avoid sandboxing issues, make sure to always run with 'Full Access'  
> Doing this is NOT a security concern as Docker provides isolation through volume mounting  
> You can do this per chat or set by default in `Settings -> General -> Permission (Full Access)`

> [!IMPORTANT]
> Currently, DSH is unable to be hosted on 0.0.0.0,  
> since: "it would expose remote code execution to the network".
> 
> This would only be a concern if ran on a local machine,  
> but since this is run in a Docker container which needs port 0.0.0.0 to properly function, 
> this script's [dsh.dockerfile](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/dsh.dockerfile) runs [socat](https://www.man7.org/linux/man-pages/man1/socat.1.html) to proxy port 3080 on 0.0.0.0 to DSH's internal 127.0.0.1:3079.  
> 
> For more information: https://github.com/deepseek-ai/deepseek-harness/discussions/76

## 📦 Install
1. Make sure the following are installed:
   * Docker CLI
   * Docker Compose
   * Git
2. Clone this repository
3. Run `./install`
4. See [compose.yml](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/compose.yml) to configure DHS-workspace volumes access
5. See [dsh.dockerfile](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/dsh.dockerfile) to configure installed container packages

## 🚀 Usage
```bash
dsh start  
dsh stop  
dsh restart (load new plugins)  

dsh app --help (must run, print help menu of the DSH binary)  
dsh app [options] [command] [args...] (must run, wraps DSH binary to allow easy access from host)  
dsh enter (must run, docker exec into the container with a shell)  

dsh update (pulls newest github version)  
dsh uninstall (removes Docker files, asks confirmation for ~/.dsh)
```

## 🤝 Contributing
Personal project. Not accepting PRs.  
Fork freely for own use.

## 📜 License
MIT; Please see the [license file](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/LICENSE) for more information. [tl;dr](https://www.tldrlegal.com/license/mit-license):
```
A short, permissive software license.
Basically, you can do whatever you want as long as you include
the original copyright and license notice in any copy of the software/source.
There are many variations of this license in use.
```
