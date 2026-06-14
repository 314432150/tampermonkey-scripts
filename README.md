# Tampermonkey Scripts

个人常用 Tampermonkey 用户脚本合集。

## 脚本列表

| 脚本 | 文件 | 功能 |
| --- | --- | --- |
| 草榴社区一键迅雷下载助手 | `t66y-thunder.user.js` | 在 t66y 移动端帖子页增加悬浮下载按钮，跳转 rmdown 后自动拦截广告弹窗并唤起标准磁力链接；Android 端会先复制磁力链接再尝试打开迅雷。 |
| 自动点击“我已认真阅读”按钮 | `auto-click-beibei.user.js` | 在匹配 `beibei` 的 dashboard 页面自动点击“我已认真阅读”关闭按钮，并通过 DOM 监听处理延迟出现的弹窗。 |

## 安装方式

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/)。
2. 打开需要安装的脚本原始文件链接。
3. 在 Tampermonkey 弹出的安装页面中确认安装。

### 直接安装

- [草榴社区一键迅雷下载助手](https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/t66y-thunder.user.js)
- [自动点击“我已认真阅读”按钮](https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/auto-click-beibei.user.js)

## 自动更新

脚本头部已配置 `@updateURL` 和 `@downloadURL`，安装后可通过 Tampermonkey 的自动更新机制获取本仓库 `main` 分支中的最新版本。

## 注意事项

- 脚本仅用于提升个人浏览体验，请根据目标网站规则和当地法律法规自行判断使用场景。
- 如果目标网站调整页面结构，脚本可能需要同步更新选择器或匹配规则。
