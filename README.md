# Paper2Galgame

## 1. 项目概述

**Paper2Galgame** 是一个基于 Web 的应用，将学术论文（PDF）转化为沉浸式 Galgame（视觉小说）对话体验。上传一篇论文，角色 **"丛雨"**（Murasame）会以二次元口吻对论文进行逐段讲解，期间你可以随时向她提问，她会结合论文内容作答。

本项目在 [Nova42x 的原始框架](https://github.com/Nova42x/Paper2Galgame) 基础上进行了大量优化改进，主要变化包括：兼容 OpenAI 协议（支持 DeepSeek、OpenAI、Ollama 等）、增加 OCR 扫描版 PDF 提取与 Gemini 多模态模式、可编辑角色人设与 API 配置、完整的日志 / 存档 / 导入导出系统等。

---

## 2. 技术栈

| 分类 | 技术 |
|------|------|
| 核心框架 | React 19（函数式组件 + Hooks） |
| 语言 | TypeScript |
| 构建工具 | [Vite 6](https://vite.dev/) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) (CDN) |
| 图标 | [FontAwesome](https://fontawesome.com/) |
| PDF 解析 | [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) 4.x |
| OCR 备用 | [Tesseract.js](https://www.npmjs.com/package/tesseract) 7.x (中英文) |
| AI 后端 (OpenAI 协议) | 原生 `fetch()` 调用 Chat Completions API |
| AI 后端 (Gemini) | [`@google/genai`](https://www.npmjs.com/package/@google/genai) 1.x SDK |
| 字体 | Noto Serif SC (中文衬线) & Nunito |

---

## 3. 项目结构

```text
/
├── index.html                          # 入口 HTML，Tailwind CDN 配置、全局样式
├── index.tsx                           # React 根节点挂载
├── App.tsx                             # 顶层组件，管理页面路由 (Title → Upload → Game → Settings)
├── types.ts                            # TypeScript 类型定义
├── vite.config.ts                      # Vite 构建配置
├── metadata.json                       # 应用元信息
├── start.bat                           # Windows 一键启动脚本
├── .env.example                        # 环境变量示例
│
├── components/
│   ├── TitleScreen.tsx                 # 标题 / 主菜单界面
│   ├── UploadScreen.tsx                # PDF 上传与解析界面
│   ├── SettingsScreen.tsx              # 设置界面（讲解参数、模型配置、角色人设）
│   ├── GameScreen.tsx                  # 教学主界面（立绘、打字机、Q&A、对话日志）
│   └── ErrorBoundary.tsx               # 错误边界，友好错误提示
│
├── services/
│   ├── backendService.ts               # 后端适配路由（分发到 openai 或 gemini）
│   ├── openaiService.ts                # OpenAI 兼容 API 调用（DeepSeek / OpenAI / Ollama 等）
│   ├── geminiService.ts                # Google Gemini 多模态 API 调用
│   ├── pdfService.ts                   # PDF 文本提取（pdf.js + Tesseract.js OCR 备用）
│   ├── personaService.ts               # 角色人设持久化（localStorage）
│   └── sessionService.ts               # 会话存档（导出 / 导入 .session.json）
│
└── config/
    ├── modelConfig.ts                  # AI 模型预设与配置持久化（DeepSeek / Gemini 预设）
    └── default_persona.json            # 默认角色人设定义
```

---

## 4. 快速开始

### 4.1 环境配置

在项目根目录创建 `.env` 文件（可参考 `.env.example`）：

```env
# OpenAI 兼容模式（DeepSeek / OpenAI / Ollama 等）
VITE_DEEPSEEK_API_KEY=sk-your-api-key-here

# Gemini 多模态模式
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

> `.env` 已加入 `.gitignore`，不会被提交到仓库。

### 4.2 启动

**方式一：一键脚本**

双击运行 `start.bat`，自动安装依赖并启动。

**方式二：手动启动**

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000` 即可使用。

---

## 5. 核心功能

### 5.1 双后端支持（OpenAI 兼容 + Gemini）

| 特性 | OpenAI 兼容模式 | Gemini 模式 |
|------|:--:|:--:|
| 支持服务 | DeepSeek / OpenAI / Ollama / vLLM 等 | Google Gemini |
| PDF 处理 | 前端 pdf.js 提取文本后发送 | 直接发送 PDF 文件（多模态原生解析） |
| OCR 备用 | Tesseract.js（中英文扫描版 PDF） | 不需要 |
| JSON 约束 | `response_format: json_object` | `responseSchema` 原生结构化输出 |

### 5.2 PDF 智能解析

- **文字型 PDF**：pdfjs-dist 逐页提取文本
- **扫描版 PDF**（无文本层）：自动回退到 Tesseract.js OCR（简体中文 + 英文）
- 在 UploadScreen 可预览和手动编辑提取的文本

### 5.3 可调角色人设

设置页面提供完整的人设编辑器：
- 角色名称、自称、对玩家的称呼
- 性格描述、口癖、语气风格、视觉描述
- 支持导入 / 导出 / 恢复默认人设配置

### 5.4 灵活的 AI 配置

- 预设 DeepSeek / Gemini 模型参数，一键切换
- 自定义 API Endpoint 和模型名，兼容所有 OpenAI 协议服务
- 配置自动持久化到 localStorage

### 5.5 讲解中即时提问（Q&A）

- 教学过程中随时点击 **Ask** 按钮提问
- 丛雨会结合论文内容和当前进度回答
- 提问回答后自动回到主线教学，无缝衔接

### 5.6 对话日志与历史回溯

- 右侧日志面板展示全部对话记录
- 点击任意历史对话可 **跳转回该位置**，重新从此处继续讲解
- 支持 Shift+Enter 换行、Enter 发送

### 5.7 存档系统

- 可随时导出当前进度为 `.session.json` 文件
- 支持导入之前的存档，恢复阅读进度
- 对话历史、Q&A 记录、教学章节一并保留
- 提取的 PDF 文本可单独导出为 `.txt` 文件

---

## 6. 常见问题

| 问题 | 排查方向 |
|------|----------|
| API Key 不生效 | 检查 `.env` 是否存在、Key 是否正确、是否以 `VITE_` 开头 |
| API 调用失败 | 打开浏览器控制台 (F12) 查看错误详情；确认网络能访问对应 API 地址 |
| PDF 无内容 | 可能是纯扫描版 PDF，等待 OCR 自动处理（可能较慢） |
| 返回格式异常 | 查看控制台中 API 返回的原始 JSON；可尝试切换后端或模型 |
| 页面白屏 | F12 查看 JS 报错；确认 `npm install` 完整执行 |
| OCR 报错 | 首次使用需下载语言包，请保持网络通畅 |

---

## 致谢

感谢 **Nova42x** 提供的 [原始框架](https://github.com/Nova42x/Paper2Galgame)。
