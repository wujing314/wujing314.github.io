# 🚀 博客部署快速指南

### 2. 项目文件结构

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── public/
│   ├── blogs/                 # 博客内容
│   ├── images/                # 图片资源
│   └── favicon.png
├── src/
│   ├── app/                   # 应用页面
│   ├── components/            # 组件
│   ├── hooks/                 # Hooks
│   ├── lib/                   # 工具函数
│   └── config/                # 配置文件
├── .env.example               # 环境变量示例
├── .gitignore                # Git 忽略文件
├── README.md                 # 项目说明
├── DEPLOYMENT.md            # 部署指南
├── VERCEL_DEPLOYMENT.md     # Vercel 详细部署指南
├── DEPLOYMENT_CHECKLIST.md  # 部署检查清单
├── deploy.sh                # Linux/Mac 部署脚本
├── deploy.bat               # Windows 部署脚本
├── next.config.ts           # Next.js 配置
├── next-sitemap.config.ts   # Sitemap 配置
├── package.json             # 项目依赖
├── tsconfig.json            # TypeScript 配置
└── vercel.json             # Vercel 配置
```

## 🎯 快速部署步骤

### 方式一：通过 Vercel 网页部署（推荐）

#### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-blog-repo.git
git push -u origin main
```

#### 2. 生成 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 复制生成的 Token（只显示一次）

#### 3. 在 Vercel 部署

1. 访问 https://vercel.com/
2. 点击 "Add New" > "Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量（见下方）
5. 点击 "Deploy"

#### 4. 配置环境变量

在 Vercel 项目设置中添加：

| 变量名 | 值 | 类型 |
|--------|-----|------|
| `NEXT_PUBLIC_GITHUB_OWNER` | 你的 GitHub 用户名 | Public |
| `NEXT_PUBLIC_GITHUB_REPO` | 博客仓库名 | Public |
| `NEXT_PUBLIC_GITHUB_BRANCH` | `main` | Public |
| `NEXT_PUBLIC_AUTH_PASSWORD` | 设置一个强密码 | Public |
| `NEXT_PUBLIC_OFFLINE_MODE` | `false` | Public |
| `NEXT_PUBLIC_DEV_MODE` | `false` | Public |
| `GITHUB_ACCESS_TOKEN` | 第 2 步生成的 Token | **Secret** |

**重要**：`GITHUB_ACCESS_TOKEN` 必须设置为 Secret 类型！

### 方式二：使用部署脚本

#### Windows 用户

```cmd
deploy.bat
```

#### Linux/Mac 用户

```bash
chmod +x deploy.sh
./deploy.sh
```

### 方式三：使用 GitHub Actions 自动部署

1. 在 Vercel 项目设置中获取：
   - Project ID
   - Organization ID
   - Personal Access Token

2. 在 GitHub 仓库设置中添加 Secrets：
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

3. 推送代码到 `main` 分支，自动触发部署

## 🔧 环境变量说明

### 必需变量

```bash
# GitHub 配置
NEXT_PUBLIC_GITHUB_OWNER=your-username          # GitHub 用户名
NEXT_PUBLIC_GITHUB_REPO=your-repo-name         # 仓库名称
NEXT_PUBLIC_GITHUB_BRANCH=main                 # 默认分支
GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxx     # GitHub Token（Secret）

# 认证配置
NEXT_PUBLIC_AUTH_PASSWORD=your-strong-password   # 管理员密码
```

### 可选变量

```bash
# 运行模式
NEXT_PUBLIC_OFFLINE_MODE=false                 # false=在线模式，true=离线模式
NEXT_PUBLIC_DEV_MODE=false                     # false=生产模式，true=开发模式

# SEO 配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # 网站URL
```

## 📝 部署后配置

### 1. 自定义域名（可选）

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录：
   - 类型: `CNAME`
   - 主机记录: `blog`
   - 记录值: `cname.vercel-dns.com`

### 2. 配置博客内容

1. 登录博客（使用设置的密码）
2. 进入编辑页面
3. 添加博客内容
4. 上传图片
5. 配置主题和样式

### 3. 测试功能

- [ ] 博客列表显示正常
- [ ] 博客详情页正常
- [ ] 编辑功能正常
- [ ] 图片上传正常
- [ ] 日记功能正常
- [ ] 项目展示正常
- [ ] 技能树正常显示
- [ ] 响应式设计正常

## 🎨 自定义配置

### 修改主题颜色

编辑 `src/config/site-content.json`：

```json
{
  "theme": {
    "colorBrand": "#2fcbe7",
    "colorPrimary": "#5B423F",
    "colorSecondary": "#8b7667",
    "colorBrandSecondary": "#eec25e",
    "colorBg": "#d4e8f3",
    "colorBorder": "#ffffff",
    "colorCard": "#ffffff99",
    "colorArticle": "#ffffffcc"
  }
}
```

### 修改网站信息

编辑 `src/config/site-content.json`：

```json
{
  "meta": {
    "title": "你的网站标题",
    "description": "网站描述",
    "username": "你的名字"
  }
}
```

### 添加社交媒体链接

编辑 `src/config/site-content.json`：

```json
{
  "socialButtons": [
    {
      "id": "github",
      "type": "github",
      "value": "https://github.com/your-username",
      "label": "GitHub",
      "order": 1
    }
  ]
}
```

## 🔍 故障排除

### 构建失败

**问题**：Vercel 构建失败

**解决方案**：
1. 检查环境变量是否完整
2. 查看 Vercel 构建日志
3. 确认 Node.js 版本（建议 18+）
4. 检查依赖版本兼容性

### 认证错误

**问题**：401 Unauthorized

**解决方案**：
1. 检查 `GITHUB_ACCESS_TOKEN` 是否正确
2. 确认 Token 有 `repo` 权限
3. 验证 Token 是否过期
4. 重新生成 Token

### 保存失败

**问题**：无法保存内容到 GitHub

**解决方案**：
1. 检查 GitHub 仓库权限
2. 验证分支名称是否正确
3. 检查网络连接
4. 查看 Vercel 函数日志

### 样式异常

**问题**：样式显示不正常

**解决方案**：
1. 清除浏览器缓存
2. 检查 Tailwind CSS 配置
3. 验证主题配置
4. 查看浏览器控制台错误

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 原部署指南
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel 详细部署指南
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 部署检查清单

## 🆘 获取帮助

如果遇到问题：

1. **查看文档**
   - [Vercel 文档](https://vercel.com/docs)
   - [Next.js 文档](https://nextjs.org/docs)

2. **检查日志**
   - Vercel 构建日志
   - 浏览器控制台
   - GitHub Actions 日志（如果使用）

3. **搜索问题**
   - GitHub Issues
   - Stack Overflow
   - Google 搜索

4. **提交问题**
   - 在项目仓库提交 Issue
   - 提供详细的错误信息
   - 附上相关日志

## 🎉 部署成功后

恭喜！你的博客已成功部署！

### 下一步建议

1. **内容创作**
   - 添加博客文章
   - 完善个人信息
   - 上传项目展示

2. **SEO 优化**
   - 提交 sitemap 到搜索引擎
   - 优化 meta 标签
   - 添加结构化数据

3. **性能优化**
   - 优化图片大小
   - 启用缓存策略
   - 监控网站性能

4. **安全加固**
   - 定期更新依赖
   - 启用 HTTPS（已自动启用）
   - 配置安全头

5. **监控维护**
   - 配置 Google Analytics
   - 设置错误监控
   - 定期备份数据

## 📞 技术支持

- **Vercel 支持**: https://vercel.com/support
- **Next.js 支持**: https://nextjs.org/docs
- **GitHub 支持**: https://support.github.com

---

**祝你部署顺利！** 🚀

如有问题，请参考详细文档或提交 Issue。