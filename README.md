# 🐋 Deepseek Harness Containerized 🐋
Linux script to install & run [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) with Searxng.  
Providing isolated workspaces through Docker.  
Creates wrapper script for easy modification and access.  
Prevents DSH from accessing unwanted files by blacklisting them with anonymous shadow volume binds through `dsh volume`.  

> [!CAUTION]
> Currently work in progress

> [!IMPORTANT]
> To avoid sandboxing issues, make sure to always run with 'Full Access'  
> Doing this is NOT a security concern as Docker provides isolation through volume mounting  
> You can do this per chat or set by default in `Settings -> General -> Permission (Full Access)`

## 📦 Install
1. Make sure the following are installed:
   * Docker CLI
   * Docker Compose
   * Git
2. Clone this repository
3. Run `./install`
4. Run `dsh volume` to configure dsh-workspace volumes access, view results in [compose.yml](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/compose.yml)
5. See [dsh.dockerfile](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/dsh.dockerfile) to configure installed container packages
5. See the bottom of [install](https://github.com/ZalmoraDev/deepseek-harness-containerized/blob/main/install) to configure installed dsh plugins

## 🚀 Usage
```
dsh help - print this home binary's help menu

dsh start - start dsh container
dsh stop - stop dsh container
dsh restart - load new plugins

dsh verify - check all volume mounts exist, remove missing entries
dsh volume - TUI for mounting a parent directory and blacklisting (shadowing) files/directories
dsh update - pulls newest github version
dsh reinstall - reruns install script
dsh uninstall - removes Docker files, asks confirmation for ./config/dsh/*

Only whilst actively running container:
dsh [args...] - passthrough to 'pnpm dsh' inside container
dsh --help - print help menu of the container DSH binary
dsh enter - docker exec into container as interactive shell
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
