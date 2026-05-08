# Vercel 部署指南

本指南将帮助你将博客部署到 Vercel 平台。

## 前置要求

1. GitHub 账号
2. Vercel 账号（可以使用 GitHub 账号登录）
3. 博客代码已推送到 GitHub 仓库

## 部署步骤

### 1. 准备 GitHub 仓库

如果还没有 GitHub 仓库，需要先创建一个：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/your-username/your-blog-repo.git

# 推送到 GitHub
git push -u origin main
```

### 2. 生成 GitHub Personal Access Token

1. 登录 GitHub，进入 [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 填写 Token 名称（如 "Blog Deployment"）
4. 选择过期时间（建议选择 "No expiration" 或较长的时间）
5. **必须勾选的权限**：
   - ✅ `repo` - 完整控制私有仓库
6. 点击 "Generate token"
7. **重要**：立即复制生成的 Token（只显示一次，之后无法再次查看）

### 3. 在 Vercel 中导入项目

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "Add New" > "Project"
3. 选择 "Import Git Repository"
4. 找到你的博客仓库并点击 "Import"

### 4. 配置项目设置

#### 4.1 配置构建命令

Vercel 会自动检测 Next.js 项目，通常会自动配置：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

如果需要手动配置，可以在项目设置中修改。

#### 4.2 配置环境变量

在 "Environment Variables" 部分添加以下变量：

| 变量名 | 值 | 说明 | 是否公开 |
|--------|-----|------|----------|
| `NEXT_PUBLIC_GITHUB_OWNER` | 你的 GitHub 用户名 | 例如：`johndoe` | 公开 |
| `NEXT_PUBLIC_GITHUB_REPO` | 博客仓库名 | 例如：`my-blog` | 公开 |
| `NEXT_PUBLIC_GITHUB_BRANCH` | 默认分支 | 通常是 `main` | 公开 |
| `NEXT_PUBLIC_AUTH_PASSWORD` | 管理员密码 | 设置一个强密码 | 公开 |
| `NEXT_PUBLIC_OFFLINE_MODE` | `false` | 在线模式 | 公开 |
| `NEXT_PUBLIC_DEV_MODE` | `false` | 生产模式 | 公开 |
| `GITHUB_ACCESS_TOKEN` | 第 2 步生成的 Token | 例如：`ghp_xxx...` | **Secret** |

**重要提示**：
- `GITHUB_ACCESS_TOKEN` 必须设置为 **Secret**，不要公开
- 其他变量可以设置为公开（Public）

#### 4.3 配置自定义域名（可选）

1. 在项目设置中找到 "Domains"
2. 点击 "Add Domain"
3. 输入你的域名（如 `blog.example.com`）
4. 在域名服务商处配置 DNS 记录：

**如果使用主域名**：
- 类型: `A`
- 主机记录: `@`
- 记录值: Vercel 提供的 IP 地址

**如果使用子域名**：
- 类型: `CNAME`
- 主机记录: `blog`
- 记录值: `cname.vercel-dns.com`

### 5. 部署项目

1. 点击 "Deploy" 按钮
2. 等待构建完成（通常需要 2-5 分钟）
3. 部署成功后，Vercel 会提供一个 `.vercel.app` 域名
4. 如果配置了自定义域名，等待 DNS 生效后即可访问

### 6. 配置自动部署（可选）

如果希望每次推送代码到 GitHub 时自动部署，可以使用 GitHub Actions：

1. 在 Vercel 项目设置中找到 "General"
2. 复制 "Project ID" 和 "Organization ID"
3. 在 GitHub 仓库中添加以下 Secrets：
   - `VERCEL_TOKEN`: Vercel Personal Access Token
   - `VERCEL_ORG_ID`: Organization ID
   - `VERCEL_PROJECT_ID`: Project ID

4. 推送代码到 `main` 分支时会自动触发部署

## 获取 Vercel Token

1. 登录 [Vercel](https://vercel.com/)
2. 点击头像 > "Settings"
3. 在左侧菜单找到 "Tokens"
4. 点击 "Create Token"
5. 填写 Token 名称和过期时间
6. 复制生成的 Token

## 环境变量详细说明

### GitHub 相关变量

```bash
NEXT_PUBLIC_GITHUB_OWNER=your-username          # GitHub 用户名
NEXT_PUBLIC_GITHUB_REPO=your-repo-name         # 仓库名称
NEXT_PUBLIC_GITHUB_BRANCH=main                 # 默认分支
GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxx     # GitHub Token（Secret）
```

### 认证相关变量

```bash
NEXT_PUBLIC_AUTH_PASSWORD=your-strong-password   # 管理员登录密码
```

### 运行模式

```bash
NEXT_PUBLIC_OFFLINE_MODE=false                 # false=在线模式，true=离线模式
NEXT_PUBLIC_DEV_MODE=false                     # false=生产模式，true=开发模式
```

## 功能说明

### 在线模式 vs 离线模式

**在线模式**（`NEXT_PUBLIC_OFFLINE_MODE=false`）：
- 数据保存到 GitHub 仓库
- 支持跨设备同步
- 需要配置 GitHub Token
- 适合多人协作或多设备使用

**离线模式**（`NEXT_PUBLIC_OFFLINE_MODE=true`）：
- 数据保存到浏览器 localStorage
- 仅本地可用
- 不需要 GitHub Token
- 适合个人本地使用

### 管理员密码

- 用于登录管理功能
- 登录状态保持 7 天
- 可以在登录页面显示/隐藏密码

## 常见问题

### 1. 构建失败

**可能原因**：
- 环境变量配置不完整
- Node.js 版本不兼容
- 依赖安装失败

**解决方法**：
- 检查所有必需的环境变量是否已配置
- 在 Vercel 项目设置中指定 Node.js 版本（建议 18+）
- 查看 Vercel 构建日志了解详细错误信息

### 2. 401 认证错误

**可能原因**：
- GitHub Token 配置错误
- Token 权限不足
- Token 已过期

**解决方法**：
- 检查 `GITHUB_ACCESS_TOKEN` 是否正确
- 确认 Token 有 `repo` 权限
- 重新生成 Token 并更新配置

### 3. 保存失败

**可能原因**：
- GitHub 仓库权限问题
- 网络连接问题
- 分支名称错误

**解决方法**：
- 确认 GitHub 仓库存在且有写入权限
- 检查网络连接
- 验证 `NEXT_PUBLIC_GITHUB_BRANCH` 是否正确

### 4. 登录密码不生效

**可能原因**：
- `NEXT_PUBLIC_AUTH_PASSWORD` 未配置
- 密码包含特殊字符

**解决方法**：
- 确保环境变量已正确配置
- 建议使用字母和数字组合的密码
- 避免使用特殊字符

## 性能优化建议

1. **图片优化**：使用 WebP 格式，压缩图片大小
2. **代码分割**：Next.js 自动进行代码分割
3. **CDN 加速**：Vercel 自动提供全球 CDN
4. **缓存策略**：静态资源自动缓存
5. **数据库优化**：合理使用 GitHub API 速率限制

## 安全建议

1. **定期更新 Token**：建议每 3-6 个月更新一次 GitHub Token
2. **使用强密码**：管理员密码至少 12 位，包含大小写字母和数字
3. **限制权限**：GitHub Token 只授予必要的权限
4. **监控日志**：定期查看 Vercel 和 GitHub 的访问日志
5. **启用 2FA**：为 GitHub 和 Vercel 账号启用两步验证

## 更新博客

部署后，更新博客非常简单：

1. 修改代码
2. 提交到 GitHub
3. Vercel 自动检测并部署
4. 几分钟后即可看到更新

## 监控和维护

### 查看部署日志

1. 进入 Vercel 项目
2. 点击 "Deployments"
3. 选择具体的部署记录
4. 查看 "Build Logs" 和 "Function Logs"

### 性能监控

Vercel 提供：
- 实时分析
- 性能指标
- 错误追踪
- 访问统计

## 成本说明

Vercel 免费套餐包含：
- 无限带宽
- 100GB/月 数据传输
- 6,000 分钟/月 构建时间
- Serverless 函数调用
- 全球 CDN

对于个人博客，免费套餐完全够用。

## 技术支持

如果遇到问题：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Next.js 文档](https://nextjs.org/docs)
3. 在 GitHub Issues 中搜索类似问题
4. 提交 Issue 寻求帮助

## 下一步

部署成功后，你可以：

1. 自定义博客主题和样式
2. 添加更多博客内容
3. 配置自定义域名
4. 启用 HTTPS（Vercel 自动提供）
5. 配置 SEO 优化
6. 添加评论功能
7. 集成分析工具

祝你部署顺利！🎉