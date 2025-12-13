# ShortShield

> 屏蔽短视频，重获专注力

[![CI](https://github.com/adalab/shortshield/actions/workflows/ci.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/ci.yml)
[![CodeQL](https://github.com/adalab/shortshield/actions/workflows/codeql.yml/badge.svg)](https://github.com/adalab/shortshield/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ShortShield 是一个浏览器扩展，通过屏蔽 YouTube Shorts、TikTok 和 Instagram Reels 上的短视频内容，帮助您保持专注。

[English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 功能

- **多平台支持**: 屏蔽 YouTube Shorts、TikTok 和 Instagram Reels 上的内容
- **精细控制**: 按平台单独启用/禁用屏蔽
- **白名单**: 允许特定频道、URL 或域名
- **自定义规则**: 添加自定义 CSS 选择器进行高级屏蔽
- **隐私优先**: 所有数据保存在本地，无外部追踪
- **跨浏览器**: 支持 Chrome 和 Firefox

## 安装

### Chrome 网上应用店

即将上线！

### Firefox 附加组件

即将上线！

### 手动安装（开发版）

1. 克隆仓库：

   ```bash
   git clone https://github.com/adalab/shortshield.git
   cd shortshield
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 构建扩展：

   ```bash
   # Chrome 版本
   pnpm build:chrome

   # Firefox 版本
   pnpm build:firefox
   ```

4. 加载扩展：
   - **Chrome**: 前往 `chrome://extensions/`，启用"开发者模式"，点击"加载已解压的扩展"，选择 `dist/chrome` 文件夹
   - **Firefox**: 前往 `about:debugging#/runtime/this-firefox`，点击"临时加载附加组件"，选择 `dist/firefox` 文件夹中的任意文件

## 使用方法

### 基本操作

1. 点击浏览器工具栏中的 ShortShield 图标
2. 使用主开关启用/禁用屏蔽
3. 根据需要切换各个平台的状态

### 白名单

1. 打开扩展选项（点击齿轮图标）
2. 进入白名单部分
3. 添加您想要允许的频道、URL 或域名

### 自定义规则

1. 打开扩展选项
2. 进入自定义规则部分
3. 添加要屏蔽元素的 CSS 选择器

## 开发

### 前提条件

- Node.js 20+
- pnpm 9+

### 命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建 Chrome 版本
pnpm build:chrome

# 构建 Firefox 版本
pnpm build:firefox

# 构建所有浏览器版本
pnpm build:all

# 运行单元测试
pnpm test:unit

# 运行端到端测试
pnpm test:e2e

# 运行代码检查
pnpm lint

# 运行类型检查
pnpm typecheck

# 检查翻译
pnpm i18n:check
```

### 项目结构

```
shortshield/
├── src/
│   ├── background/     # Service Worker
│   ├── content/        # 内容脚本
│   │   ├── platforms/  # 平台检测器
│   │   └── actions/    # 屏蔽操作
│   ├── popup/          # 弹出窗口界面
│   ├── options/        # 选项页面
│   └── shared/         # 共享工具
├── public/
│   ├── icons/          # 扩展图标
│   └── _locales/       # 国际化消息
├── tests/
│   ├── unit/           # 单元测试
│   ├── integration/    # 集成测试
│   └── e2e/            # 端到端测试
└── docs/               # 文档
```

## 隐私

ShortShield 以隐私为设计核心：

- **不收集数据**: 我们不收集任何用户数据
- **无外部请求**: 所有功能均可离线使用
- **仅本地存储**: 设置仅存储在浏览器本地
- **开源**: 代码功能完全透明

详情请查看我们的[隐私政策](docs/PRIVACY_POLICY.md)。

## 贡献

欢迎贡献！详情请查看我们的[贡献指南](CONTRIBUTING.md)。

### 翻译

帮助我们将 ShortShield 翻译成更多语言。请查看 [TRANSLATING.md](TRANSLATING.md) 了解说明。

## 安全

安全问题请查看我们的[安全政策](SECURITY.md)。

## 许可证

[MIT](LICENSE)

## 致谢

- 使用 [React](https://react.dev/) 构建
- 使用 [Vite](https://vitejs.dev/) 打包
- 扩展框架来自 [@crxjs/vite-plugin](https://crxjs.dev/)
