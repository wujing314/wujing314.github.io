# 部署前检查清单

在部署博客到 Vercel 之前，请确保完成以下检查：

## ✅ 代码检查

- [ ] 代码已提交到 GitHub 仓库
- [ ] 所有依赖已正确安装（`npm install`）
- [ ] 本地构建成功（`npm run build`）
- [ ] 没有编译错误或警告
- [ ] 测试了所有主要功能

## ✅ 配置文件检查

- [ ] `package.json` 配置正确
- [ ] `next.config.ts` 配置正确
- [ ] `tsconfig.json` 配置正确
- [ ] `.gitignore` 包含所有必要的内容
- [ ] `vercel.json` 已创建（可选）

## ✅ 环境变量检查

### GitHub 配置
- [ ] `NEXT_PUBLIC_GITHUB_OWNER` - GitHub 用户名
- [ ] `NEXT_PUBLIC_GITHUB_REPO` - 仓库名称
- [ ] `NEXT_PUBLIC_GITHUB_BRANCH` - 默认分支（通常是 `main`）
- [ ] `GITHUB_ACCESS_TOKEN` - GitHub Personal Access Token（设置为 Secret）

### 认证配置
- [ ] `NEXT_PUBLIC_AUTH_PASSWORD` - 管理员密码（建议使用强密码）

### 运行模式
- [ ] `NEXT_PUBLIC_OFFLINE_MODE` - 设置为 `false`（在线模式）
- [ ] `NEXT_PUBLIC_DEV_MODE` - 设置为 `false`（生产模式）

## ✅ GitHub Token 检查

- [ ] 已生成 GitHub Personal Access Token
- [ ] Token 有 `repo` 权限
- [ ] Token 未过期
- [ ] Token 已正确添加到 Vercel 环境变量（设置为 Secret）

## ✅ 内容检查

- [ ] 博客内容已添加
- [ ] 图片资源已上传到 `public/` 目录
- [ ] 配置文件（`site-content.json`）已正确设置
- [ ] 所有链接和图片路径正确

## ✅ 安全检查

- [ ] `GITHUB_ACCESS_TOKEN` 设置为 Secret，不是 Public
- [ ] 管理员密码足够强（至少 12 位，包含大小写字母和数字）
- [ ] 没有敏感信息提交到代码仓库
- [ ] `.env.local` 文件未提交到 Git（已在 `.gitignore` 中）

## ✅ 性能检查

- [ ] 图片已优化（使用 WebP 格式，压缩大小）
- [ ] 没有不必要的依赖包
- [ ] 代码已优化（移除注释和调试代码）
- [ ] 启用了代码分割（Next.js 自动处理）

## ✅ SEO 检查

- [ ] 网站标题已设置
- [ ] 网站描述已设置
- [ ] Favicon 已添加
- [ ] Open Graph 标签已配置
- [ ] Sitemap 已生成（`next-sitemap`）

## ✅ 功能测试

### 本地测试
- [ ] 首页正常显示
- [ ] 博客列表正常加载
- [ ] 博客详情页正常显示
- [ ] 编辑功能正常工作
- [ ] 登录认证正常
- [ ] 图片上传正常
- [ ] 日记功能正常
- [ ] 项目展示正常
- [ ] 技能树正常显示
- [ ] 音乐播放器正常
- [ ] 响应式设计正常（测试不同设备）

### 在线功能测试（部署后）
- [ ] GitHub 集成正常
- [ ] 数据保存到 GitHub 正常
- [ ] 跨设备同步正常
- [ ] 所有页面加载速度正常

## ✅ Vercel 配置

- [ ] 项目已导入到 Vercel
- [ ] 构建命令正确（`npm run build`）
- [ ] 输出目录正确（`.next`）
- [ ] 环境变量已全部配置
- [ ] 自定义域名已配置（如果需要）
- [ ] DNS 记录已正确设置（如果使用自定义域名）

## ✅ 备份检查

- [ ] GitHub 仓库已备份
- [ ] 重要配置文件已备份
- [ ] 数据已备份（博客内容、图片等）

## 🚀 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **在 Vercel 中导入项目**
   - 登录 Vercel
   - 点击 "Add New" > "Project"
   - 选择 GitHub 仓库并导入

3. **配置环境变量**
   - 添加所有必需的环境变量
   - 确保 `GITHUB_ACCESS_TOKEN` 设置为 Secret

4. **部署项目**
   - 点击 "Deploy" 按钮
   - 等待构建完成

5. **测试部署**
   - 访问提供的 URL
   - 测试所有功能
   - 检查控制台是否有错误

6. **配置自定义域名（可选）**
   - 在 Vercel 中添加域名
   - 配置 DNS 记录
   - 等待 DNS 生效

## 📋 部署后检查

- [ ] 网站可以正常访问
- [ ] 所有页面正常加载
- [ ] 功能测试通过
- [ ] 没有控制台错误
- [ ] 性能良好（加载速度快）
- [ ] SEO 元数据正确
- [ ] 移动端显示正常

## 🎉 完成后

恭喜！你的博客已成功部署到 Vercel！

### 后续优化建议

1. **性能优化**
   - 启用图片优化
   - 使用 CDN 加速
   - 优化代码分割

2. **SEO 优化**
   - 提交 sitemap 到搜索引擎
   - 优化 meta 标签
   - 添加结构化数据

3. **安全加固**
   - 定期更新依赖
   - 启用 HTTPS
   - 配置安全头

4. **监控和分析**
   - 配置 Google Analytics
   - 设置错误监控
   - 监控网站性能

5. **内容维护**
   - 定期更新博客
   - 备份重要数据
   - 优化用户体验

## 🆘 常见问题

### 构建失败
- 检查环境变量是否完整
- 查看 Vercel 构建日志
- 确认依赖版本兼容性

### 功能异常
- 检查 GitHub Token 配置
- 验证 API 权限
- 查看浏览器控制台错误

### 性能问题
- 优化图片大小
- 减少不必要的依赖
- 启用缓存策略

## 📞 获取帮助

如果遇到问题：
1. 查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
2. 检查 [Vercel 文档](https://vercel.com/docs)
3. 查看 [Next.js 文档](https://nextjs.org/docs)
4. 提交 GitHub Issue

---

**最后更新**: 2025-05-08