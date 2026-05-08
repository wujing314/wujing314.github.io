@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始部署博客到 Vercel...
echo.

REM 检查是否安装了 Vercel CLI
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Vercel CLI
    echo 正在安装 Vercel CLI...
    call npm install -g vercel
)

REM 检查是否已登录
echo 📋 检查登录状态...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 请先登录 Vercel:
    call vercel login
)

REM 安装依赖
echo 📦 安装依赖...
call npm install

REM 构建项目
echo 🔨 构建项目...
call npm run build

REM 部署到 Vercel
echo 🌐 部署到 Vercel...
call vercel --prod

echo.
echo ✅ 部署完成！
echo 请访问 Vercel 提供的 URL 查看你的博客

pause