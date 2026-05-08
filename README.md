# 博客项目

一个基于 Next.js 16 构建的现代化个人博客，支持 Markdown 写作、日记管理、项目展示等功能。

## ✨ 特性

- 📝 **Markdown 写作** - 支持实时预览的 Markdown 编辑器
- 📅 **日记管理** - 日历视图管理日记，支持分类和标签
- 🎨 **项目展示** - 精美的项目卡片展示
- 🌳 **技能树** - 可视化技能展示
- 🎵 **音乐播放器** - 内置音乐播放功能
- 🖼️ **图片管理** - 支持图片上传和展示
- 🔐 **密码保护** - 管理功能需要密码认证
- 📱 **响应式设计** - 完美适配各种设备
- 🌙 **主题定制** - 支持自定义颜色和样式

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:2025](http://localhost:2025)

### 构建生产版本

```bash
npm run build
npm run start
```

## 📦 部署

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（见下方）
4. 部署完成

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## ⚙️ 环境变量

创建 `.env.local` 文件并配置以下变量：

```bash
# GitHub 配置（在线模式必需）
NEXT_PUBLIC_GITHUB_OWNER=your-github-username
NEXT_PUBLIC_GITHUB_REPO=your-blog-repo
NEXT_PUBLIC_GITHUB_BRANCH=main
GITHUB_ACCESS_TOKEN=ghp_xxx

# 认证配置
NEXT_PUBLIC_AUTH_PASSWORD=your-admin-password

# 运行模式
NEXT_PUBLIC_OFFLINE_MODE=false
NEXT_PUBLIC_DEV_MODE=false
```

## 📁 项目结构

```
blog/
├── src/
│   ├── app/              # 应用页面
│   │   ├── (home)/      # 首页相关
│   │   ├── blog/        # 博客页面
│   │   ├── diary/       # 日记页面
│   │   ├── projects/    # 项目页面
│   │   └── ...
│   ├── components/       # React 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具函数
│   └── config/          # 配置文件
├── public/              # 静态资源
└── package.json         # 项目配置
```

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: React 19
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **Markdown**: Marked + Shiki
- **状态管理**: Zustand
- **数据请求**: SWR

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！