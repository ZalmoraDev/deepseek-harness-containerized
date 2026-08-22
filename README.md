# 🐋 Deepseek Harness Containerized 🐋
Simple script to install & run DeepSeek Harness (DSH) with isolated workspaces through Docker.  
Prevent DSH from accessing unwanted directories by whitelisting volumes  
> [!NOTE]
> See `compose.yml` for examples

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