# 博客部署指南

## 概述

本博客基于 Next.js 构建，支持在 GitHub + Vercel 上部署，实现密码保护的在线编辑和日记功能。

## 部署步骤

### 1. 创建 GitHub 仓库

将博客代码推送到 GitHub 仓库。

### 2. 生成 GitHub Access Token

1. 登录 GitHub，进入 [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 填写 Token 名称，选择过期时间
4. **必须勾选的权限**：
   - `repo` - 完整控制私有仓库
5. 点击 "Generate token"，复制生成的 Token（只显示一次）

### 3. 在 Vercel 配置环境变量

1. 登录 [Vercel](https://vercel.com/)，导入 GitHub 仓库
2. 进入项目设置 > Environment Variables
3. 添加以下环境变量：

| 变量名 | 值 | 是否公开 |
|--------|-----|----------|
| NEXT_PUBLIC_GITHUB_OWNER | 你的 GitHub 用户名 | 公开 |
| NEXT_PUBLIC_GITHUB_REPO | 博客仓库名 | 公开 |
| NEXT_PUBLIC_GITHUB_BRANCH | main | 公开 |
| NEXT_PUBLIC_AUTH_PASSWORD | 你的管理员密码 | 公开 |
| GITHUB_ACCESS_TOKEN | 第 2 步生成的 Token | **Secret** |
| NEXT_PUBLIC_OFFLINE_MODE | false | 公开 |
| NEXT_PUBLIC_DEV_MODE | false | 公开 |

### 4. 配置自定义域名（可选）

1. 在 Vercel 项目设置 > Domains
2. 添加你的域名（如 `blog.wujing.com`）
3. 在域名服务商处配置 DNS 记录：
   - 类型: CNAME
   - 主机记录: blog
   - 记录值: cname.vercel-dns.com

## 环境变量说明

```bash
# GitHub 配置
NEXT_PUBLIC_GITHUB_OWNER=your-github-username    # GitHub 用户名
NEXT_PUBLIC_GITHUB_REPO=your-blog-repo            # 博客仓库名
NEXT_PUBLIC_GITHUB_BRANCH=main                    # 默认分支

# 认证配置
NEXT_PUBLIC_AUTH_PASSWORD=your-password           # 管理员登录密码

# GitHub Token（在线模式必需）
GITHUB_ACCESS_TOKEN=ghp_xxx                       # GitHub Access Token（Secret）

# 运行模式
NEXT_PUBLIC_OFFLINE_MODE=false                    # 在线模式：false，离线模式：true
NEXT_PUBLIC_DEV_MODE=false                        # 开发模式
```

## 功能说明

### 登录认证
- 访问编辑功能需要输入管理员密码
- 登录状态保持 7 天
- 支持密码显示/隐藏切换

### 日记功能
- 支持通过日历选择日期写日记
- 支持导入 Markdown 文件
- 支持分类管理
- 数据自动保存到 GitHub 仓库

### 在线/离线模式
- **在线模式**（OFFLINE_MODE=false）：数据保存到 GitHub 仓库，跨设备同步
- **离线模式**（OFFLINE_MODE=true）：数据保存到浏览器 localStorage，仅本地可用

## 安全注意事项

1. **GitHub Token 安全性**：务必将 `GITHUB_ACCESS_TOKEN` 设置为 Secret，不要提交到代码仓库
2. **管理员密码**：选择强密码，不要使用默认密码
3. **定期轮换**：定期更新 GitHub Token 和管理员密码
4. **权限最小化**：Token 只授予必要的权限（repo）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run start
```

本地开发时建议设置 `NEXT_PUBLIC_OFFLINE_MODE=true`，避免频繁调用 GitHub API。

## 目录结构

```
blog/
├── src/
│   ├── app/              # 应用页面
│   ├── components/       # 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数
│   └── config/           # 配置文件
├── public/               # 静态资源
├── .env.local           # 本地环境变量
└── package.json         # 项目配置
```

## 故障排除

### 常见问题

1. **401 认证错误**：
   - 检查 GitHub Token 是否正确配置
   - 确保 Token 有 repo 权限
   - 检查 Token 是否过期

2. **保存失败**：
   - 检查环境变量是否完整
   - 确保 GitHub 仓库有正确的分支
   - 检查网络连接

3. **登录密码不生效**：
   - 检查 `NEXT_PUBLIC_AUTH_PASSWORD` 是否正确配置
   - 确保没有空格或特殊字符

### 日志查看

在 Vercel 控制台查看函数日志，了解具体错误信息。

## 更新博客

1. 修改代码后推送到 GitHub
2. Vercel 会自动触发部署
3. 部署完成后即可访问更新后的博客