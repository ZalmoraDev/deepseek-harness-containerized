# 🐋 Deepseek Harness Containerized 🐋
Simple script to install & run DeepSeek Harness (DSH) with isolated workspaces through Docker.  
Prevent DSH from accessing unwanted directories by whitelisting volumes  
> [!NOTE]
> See `compose.yml` for examples

> [!IMPORTANT]
> Currently DSH is unable to be hosted on 0.0.0.0,  
> since: "it would expose remote code execution to the network".  
> This would only be a concern if ran on a local machine,  
> but since this is run in a Docker container which needs port 0.0.0.0 to properly function,  
> this script's `dsh.dockerfile` runs **socat** to proxy port 3080 on 0.0.0.0 to DSH's internal 127.0.0.1:3079,  
> since DSH intentionally rejects binding to 0.0.0.0 directly.  
> For more information: https://github.com/deepseek-ai/deepseek-harness/discussions/76

## 📦 Install
1. Make sure the following are installed:
   * Docker CLI
   * Docker Compose
   * Git
2. Clone this repository
3. Run `./install`
4. See `compose.yml` to configure DHS-workspace volumes access


## 🚀 Usage
```bash
dsh start
dsh stop
dsh update # git pull lastest version
```

## 🤝 Contributing
Personal project. Not accepting PRs.  
Fork freely for own use.

## 📜 License
Please see the [license file](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/LICENSE) for more information. [tl;dr](https://www.tldrlegal.com/license/mit-license):
```
A short, permissive software license.
Basically, you can do whatever you want as long as you include
the original copyright and license notice in any copy of the software/source.
There are many variations of this license in use.
```
