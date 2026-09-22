# 🛡️ Operit 相册防误扫卫士 (Media Shield)

> 防止 Operit 的 TypeScript 代码文件（`.ts`）及临时缓存被 Android 系统相册误识别为损坏视频的开源工具包。

[![GitHub release](https://img.shields.io/github/v/release/Lmeng486/operit-media-shield?color=brightgreen)](https://github.com/Lmeng486/operit-media-shield/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 问题背景

在使用 **Operit** 进行插件扩展开发（`dev_package`）或日常运行过程中，许多用户的手机相册中经常会出现大量**无法播放、黑屏或显示为损坏的“幽灵视频”**。

### 根本原因
1. **后缀语义冲突**：
   * 在编程开发领域，`.ts` 代表 **TypeScript 代码定义文件**（如 `results.d.ts`）。
   * 在 Android 系统的媒体扫描器（`MediaStore`）识别体系中，`.ts` 默认被无差别判定为 **MPEG-2 Transport Stream 视频流**（MIME 类型为 `video/mp2ts`）。
2. **连锁功能破坏**：
   * 用户在相册看到损坏视频往往会习惯性点击“删除”。而在 Android 相册中执行删除是**直接物理抹除源文件**，会导致 Operit 核心插件依赖缺失，从而引发 `FileNotFoundException` 错误。

---

## ✨ 核心功能

本插件提供两个轻量级核心工具（无需复杂后台常驻）：

1. **`enable_shield` (一键部署防护)**：
   * 自动在 `/sdcard/Download/Operit/` 目录注入 `.nomedia` 免疫标记，使 Android 媒体服务永久忽略该目录及子目录。
   * 自动生成中文防误删说明文件 `【请勿删除】Operit系统配置与开发目录.txt`，防止日常清理误删。
   * 自动广播系统扫描事件，即时生效。

2. **`clean_broken_video_index` (清理相册遗留索引)**：
   * 针对手机相册里已经存在的破损视频记录，直接在系统媒体数据库（MediaStore）中精准定位并清除索引。
   * 无需用户重启手机，相册内已存在的“破损视频”图标立即消失。

---

## 🚀 安装与使用

### 方式一：在 Operit 中直接导入（推荐）
1. 在 [Releases 页面](https://github.com/Lmeng486/operit-media-shield/releases) 下载最新的 `media_shield.js`。
2. 打开 Operit -> 点击右侧或设置中的 **扩展包管理**。
3. 点击右上角 **导入本地脚本包**，选择下载的 `media_shield.js` 即可启用。

### 方式二：对话中直接调用
导入包后，你可以直接对助手（柠檬）说：
* *“帮我开启相册防护”* -> 自动触发 `enable_shield`
* *“清理相册里的坏视频索引”* -> 自动触发 `clean_broken_video_index`

---

## 📄 开源许可证

本项目基于 [MIT 许可证](LICENSE) 开源。欢迎提 Issue 与 PR 交流完善！
