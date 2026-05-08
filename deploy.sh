#!/bin/bash

# 博客部署脚本
# 用于快速部署到 Vercel

set -e

echo "🚀 开始部署博客到 Vercel..."
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未检测到 Vercel CLI"
    echo "正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
echo "📋 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录 Vercel:"
    vercel login
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo "请访问 Vercel 提供的 URL 查看你的博客"