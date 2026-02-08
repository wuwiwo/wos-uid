# ❄️ WOS UID 查询工具 / WOS UID Query Tool

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🌐 WOS UID Query Tool (English)

A professional, modular web-based tool for querying player information in the game "Whiteout Survival" (寒霜启示录) using UID.

### ✨ v1.3.0 New Features
- **Modular Architecture**: Decoupled core logic (`index.js`) from translations (`i18n.js`).
- **Multi-language Support**: Supports English, Chinese (Simplified/Traditional), Japanese, Korean, and Arabic.
- **Smart Persistence**: Remembers your language preference and search history locally.
- **RTL Support**: Fully compatible UI for Right-to-Left languages like Arabic.

### 🚀 Quick Start
1. **Access**: [https://wuwiwo.github.io/wos-uid/](https://wuwiwo.github.io/wos-uid/)
2. **Search**: Enter a UID (e.g., `251097717`) and press Enter.
3. **History**: Click on any history card to re-query instantly.

### 🛠️ Technical Details
- **Frontend**: HTML5, CSS3 (Glassmorphism UI), Vanilla JavaScript.
- **Security**: MD5-based API signatures for secure communication.
- **Data Handling**: Robust type checking to prevent rendering errors (e.g., handling null furnace content).

---

<a name="中文"></a>
## 🌐 WOS UID 查询工具 (中文)

专为《寒霜启示录》(Whiteout Survival) 玩家设计的专业信息查询工具。

### 🌐 在线地址
[https://wuwiwo.github.io/wos-uid/](https://wuwiwo.github.io/wos-uid/)

### ✨ 核心功能
- **深度数据解析**: 完美解析熔炉等级（支持 30 级后的 FC 极寒等级映射）。
- **全语种支持**: 智能识别浏览器语言，支持简/繁、英、日、韩、阿等主流语种。
- **模块化重构**: 采用 `i18n.js` 配置与 `index.js` 逻辑分离架构，代码更易维护。
- **极致体验**: 
  - **毛玻璃 UI**: 现代科技感视觉设计。
  - **自动保存**: 记录最近 20 条查询历史，支持一键清空。
  - **适配移动端**: 响应式设计，手机查询同样丝滑。

### 🚀 技术细节
- **文件结构**:
  - `index.html`: 主入口文件。
  - `i18n.js`: 国际化文本配置中心（新增）。
  - `index.js`: 核心逻辑、API 通讯与 DOM 调度。
  - `index.css`: 全局样式与动画适配。
- **安全性**: 所有请求直接发往游戏官方 API，本地浏览器仅存储搜索历史，不收集隐私。

### 🛠️ 最近修复 (v1.3.0)
- **修复**: 解决了 `stove_lv_content` 为空时导致的 `startsWith` 报错。
- **修复**: 修复了重构后 `config` 变量未定义的引用错误。
- **优化**: 完善了历史记录在切换语言时的同步渲染逻辑。

---
*Disclaimer: This tool is for educational and community use only. All game data is property of Century Games.*
