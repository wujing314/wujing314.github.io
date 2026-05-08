'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useMarkdownRender } from '@/hooks/use-markdown-render'
import { pushAbout, type AboutData } from './services/push-about'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { loadFromLocalStorage } from '@/lib/local-storage'
import { GITHUB_CONFIG } from '@/consts'
import LikeButton from '@/components/like-button'
import GithubSVG from '@/svgs/github.svg'
import { LoginModal } from '@/components/login-modal'

const ABOUT_KEY = 'about_data'

export default function Page() {
	const [data, setData] = useState<AboutData>({} as AboutData)
	const [originalData, setOriginalData] = useState<AboutData>({} as AboutData)
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isPreviewMode, setIsPreviewMode] = useState(false)

	const { isAuth, setPassword } = useAuthStore()
	const { siteContent } = useConfigStore()
	const { content, loading } = useMarkdownRender(data.content || '')
	const hideEditButton = siteContent.hideEditButton ?? false

	// Initialize data if not loaded
	useEffect(() => {
		const initialData = {
			title: '个人简历',
			description: '电气工程及其自动化专业 | 专注单片机与物联网技术',
			content: `# 👋 你好，我是吴晶

## 📋 基本信息
- **姓名**: 吴晶
- **性别**: 男 | **年龄**: 20岁
- **就读学校**: 广州航海学院
- **专业班级**: 电气211
- **出生日期**: 2003-08-25
- **联系电话**: 13427784352
- **出生地址**: 湖南
- **期望岗位**: 嵌入式开发工程师、物联网技术工程师

## 🎯 技能特长

### 硬件开发
- **微控制器**: STM32、ESP系列、51单片机
- **PCB设计**: PBC板制作焊接、电路设计
- **传感器应用**: 各类传感器数据采集与控制
- **电源管理**: 锂电池供电系统、电压调节

### 软件开发
- **编程语言**: C/C++、Python、JavaScript
- **Web开发**: HTML+CSS+JS网页设计与服务器搭建
- **数据库**: SQL基础应用
- **人工智能**: AI工具应用与实践

### 办公技能
- **WPS JS宏**: 办公软件自动化处理
- **SolidWorks**: 3D建模与设计
- **PLC控制**: 工业自动化系统集成

## 📚 学习经历

### 大一 - 大二上
**探索阶段**
接触e语言、lua语言，制作游戏脚本、刷课辅助等工具，加强编程逻辑思维训练。

### 大二下
**入门阶段**
从51单片机入门，深入学习STM32单片机知识，使用keil5制作小项目检验学习成果。

### 大二下 - 大三
**发展阶段**
学习PLC控制技术，深入掌握PLC应用，接触ESP系列单片机进入物联网领域。

### 大三 - 未来
**优化提升**
接触并使用人工智能提高工作学习效率，学习更多专业知识，加入优质团队共同进步。

## 🏆 获奖经历
- **蓝桥杯省三等奖**
- **团队程序设计天梯赛团队省二等奖，个人全国三等奖**
- **校赛三等奖**

## 🛠️ 项目经验
- **智能小车项目**: 基于STM32+nrf24l01的摇杆遥控小车
- **PLC控制系统**: 三层电梯控制系统、多病床呼叫系统
- **物联网应用**: ESP系列单片机与网络通信技术结合的智能家居控制系统

## 🎮 兴趣爱好
- **科学探索**: 对理科有浓厚兴趣，特别是数学物理领域
- **乒乓球**: 业余运动爱好
- **游戏开发**: 脚本程序制作与自动化工具开发
- **人工智能**: 关注AI技术发展与应用

## 📞 联系方式
- **微信**: 13427784352
- **QQ**: 2099915224
- **邮箱**: 2099915224@qq.com
- **宿舍地址**: 南七314

## 🔗 社交媒体
- **GitHub**: [github.com/wujing-dev](https://github.com/wujing-dev)
- **CSDN**: [blog.csdn.net/wujing_dev](https://blog.csdn.net/wujing_dev)
- **Bilibili**: [space.bilibili.com/wujing-tech](https://space.bilibili.com/wujing-tech)
- **LinkedIn**: 职业发展网络

---

*很高兴认识你！希望有机会一起交流学习。*`
		}
		
		const loadData = async () => {
			if (GITHUB_CONFIG.OFFLINE_MODE) {
				const localData = await loadFromLocalStorage<AboutData>(ABOUT_KEY)
				if (localData && localData.title) {
					setData(localData)
					setOriginalData(localData)
					return
				}
			}
			if (!data.title) {
				setData(initialData)
				setOriginalData(initialData)
			}
		}
		
		loadData()
	}, [])

	const handleSaveClick = () => {
		if (!isAuth) {
			setIsEditMode(true) // This will trigger the login modal
			return
		}
		handleSave()
	}

	const handleEnterEditMode = () => {
		setIsEditMode(true)
		setIsPreviewMode(false)
	}

	const handleSave = async () => {
		setIsSaving(true)

		try {
			await pushAbout(data)

			setOriginalData(data)
			setIsEditMode(false)
			setIsPreviewMode(false)
			toast.success('保存成功！')
		} catch (error: any) {
			console.error('Failed to save:', error)
			toast.error(`保存失败: ${error?.message || '未知错误'}`)
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		setData(originalData)
		setIsEditMode(false)
		setIsPreviewMode(false)
	}

	const buttonText = isAuth ? '保存' : '输入密码'

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isEditMode && (e.ctrlKey || e.metaKey) && e.key === ',') {
				e.preventDefault()
				setIsEditMode(true)
				setIsPreviewMode(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isEditMode])

	return (
		<>
			{/* Login Modal for direct password input */}
			<LoginModal
				open={!isAuth && isEditMode}
				onClose={() => setIsEditMode(false)}
				onSuccess={() => setIsEditMode(true)}
			/>

			<div className='flex flex-col lg:flex-row items-start justify-center gap-8 px-6 pt-24 pb-12 max-sm:px-4 max-w-6xl mx-auto'>
				{/* Left Sidebar - Resume Style */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
					className='lg:w-80 space-y-6 flex-shrink-0'
				>
					{/* Avatar */}
					<div className='card relative p-6 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
						<div className='text-center'>
							<img
								src='/images/avatar.png'
								alt='个人头像'
								className='mx-auto w-32 h-32 rounded-full object-cover border-4 border-brand/20 shadow-lg'
							/>
							<h2 className='mt-4 text-2xl font-bold text-primary'>吴晶</h2>
							<p className='text-secondary mt-2'>电气工程学生</p>
							<p className='text-brand text-sm mt-1'>专注单片机与物联网技术</p>
						</div>
					</div>

					{/* Basic Info */}
					<div className='card relative p-6 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
						<h3 className='font-semibold text-primary mb-4 flex items-center'>
							<svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
							</svg>
							基本信息
						</h3>
						<div className='space-y-3 text-sm'>
							<div className='flex justify-between'>
								<span className='text-secondary'>年龄:</span>
								<span className='font-medium'>20岁</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-secondary'>学校:</span>
								<span className='font-medium'>广州航海学院</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-secondary'>专业:</span>
								<span className='font-medium'>电气211</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-secondary'>电话:</span>
								<span className='font-medium'>13427784352</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-secondary'>邮箱:</span>
								<span className='font-medium'>2099915224@qq.com</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-secondary'>地址:</span>
								<span className='font-medium'>南七314</span>
							</div>
						</div>
					</div>

					{/* Social Media Links */}
					<div className='card relative p-6 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
						<h3 className='font-semibold text-primary mb-4 flex items-center'>
							<svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
							</svg>
							社交媒体
						</h3>
						<div className='grid grid-cols-2 gap-3'>
							<motion.a
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href='https://github.com/wujing-dev'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors'
								title='GitHub 个人主页'
							>
								<GithubSVG className='w-6 h-6' />
							</motion.a>
							<motion.a
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href='https://blog.csdn.net/wujing_dev'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-center p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors'
								title='CSDN 技术博客'
							>
								<div className='w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>C</div>
							</motion.a>
							<motion.a
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href='https://space.bilibili.com/wujing-tech'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors'
								title='B站 技术分享'
							>
								<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold'>B</div>
							</motion.a>
							<motion.a
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href='mailto:2099915224@qq.com'
								className='flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors'
								title='发送邮件'
							>
								<svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
								</svg>
							</motion.a>
						</div>
					</div>

					{/* Quick Stats */}
					<div className='card relative p-6 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
						<h3 className='font-semibold text-primary mb-4'>快速统计</h3>
						<div className='space-y-3 text-sm'>
							<div className='flex justify-between items-center'>
								<span className='text-secondary'>学习年限</span>
								<span className='font-bold text-brand'>3年+</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-secondary'>项目经验</span>
								<span className='font-bold text-brand'>10+个</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-secondary'>获奖次数</span>
								<span className='font-bold text-brand'>5次+</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-secondary'>技能掌握</span>
								<span className='font-bold text-brand'>20+项</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Main Content Area */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='flex-1 min-w-0'
				>
					<div className='w-full'>
						{isEditMode ? (
							isPreviewMode ? (
								<div className='space-y-6'>
									<div className='text-center'>
										<h1 className='mb-4 text-3xl font-bold'>{data.title || '标题预览'}</h1>
										<p className='text-secondary text-lg'>{data.description || '描述预览'}</p>
									</div>

									{loading ? (
										<div className='text-secondary text-center'>预览渲染中...</div>
									) : (
										<div className='card relative p-8 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
											<div className='prose prose-sm max-w-none'>{content}</div>
										</div>
									)}
								</div>
							) : (
								<div className='space-y-6'>
									<div className='space-y-4'>
										<input
											type='text'
											placeholder='标题'
											className='w-full px-4 py-3 text-center text-2xl font-bold'
											value={data.title}
											onChange={e => setData({ ...data, title: e.target.value })}
										/>
										<input
											type='text'
											placeholder='描述'
											className='w-full px-4 py-3 text-center text-lg'
											value={data.description}
											onChange={e => setData({ ...data, description: e.target.value })}
										/>
									</div>

									<div className='card relative backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'>
										<textarea
											placeholder='Markdown 内容'
											className='min-h-[500px] w-full resize-none text-sm p-6'
											value={data.content}
											onChange={e => setData({ ...data, content: e.target.value })}
										/>
									</div>
								</div>
							)
						) : (
							<>
								{loading ? (
									<div className='text-secondary text-center'>加载中...</div>
								) : (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='card relative p-8 backdrop-blur-md bg-white/70 rounded-2xl shadow-lg border border-white/50'
									>
										<div className='prose prose-sm max-w-none'>{content}</div>
									</motion.div>
								)}
							</>
						)}

						<div className='mt-8 flex items-center justify-center gap-6'>
							<motion.a
								href='https://github.com/wujing-dev/2025-blog-public'
								target='_blank'
								rel='noreferrer'
								initial={{ opacity: 0, scale: 0.6 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.1 }}
								className='bg-card flex h-[53px] w-[53px] items-center justify-center rounded-full border'
							>
								<GithubSVG />
							</motion.a>

							<LikeButton slug='open-source' delay={0} />
						</div>
					</div>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className='fixed top-4 right-6 z-10 flex gap-3 max-sm:hidden'
			>
				{isEditMode ? (
					<>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCancel}
							disabled={isSaving}
							className='rounded-xl border bg-white/60 px-6 py-2 text-sm'
						>
							取消
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsPreviewMode(prev => !prev)}
							disabled={isSaving}
							className={`rounded-xl border bg-white/60 px-6 py-2 text-sm`}
						>
							{isPreviewMode ? '继续编辑' : '预览'}
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSaveClick}
							disabled={isSaving}
							className='brand-btn px-6'
						>
							{isSaving ? '保存中...' : buttonText}
						</motion.button>
					</>
				) : (
					!hideEditButton && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleEnterEditMode}
							className='rounded-xl border bg-white/60 px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'
						>
							编辑
						</motion.button>
					)
				)}
			</motion.div>
		</>
	)
}