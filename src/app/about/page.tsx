'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useMarkdownRender } from '@/hooks/use-markdown-render'
import { pushAbout, type AboutData } from './services/push-about'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { loadFromLocalStorage } from '@/lib/local-storage'
import LikeButton from '@/components/like-button'
import GithubSVG from '@/svgs/github.svg'
import LinkedinSVG from '@/svgs/linkedin.svg'
import MailSVG from '@/svgs/email.svg'
import BilibiliSVG from '@/svgs/哔哩哔哩.svg'
import JuejinSVG from '@/svgs/juejin.svg'
import initialData from './list.json'

const loadAboutData = (): AboutData => {
	const savedData = loadFromLocalStorage<AboutData>('about', null)
	return savedData || initialData
}

export default function Page() {
	const [data, setData] = useState<AboutData>(loadAboutData)
	const [originalData, setOriginalData] = useState<AboutData>(loadAboutData)
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isPreviewMode, setIsPreviewMode] = useState(false)
	const [activeSocial, setActiveSocial] = useState<string | null>(null)

	const { siteContent } = useConfigStore()
	const { content, loading } = useMarkdownRender(data.content)
	const hideEditButton = siteContent.hideEditButton ?? false

	const handleSaveClick = () => {
		void handleSave()
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

	const buttonText = '保存'

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

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com', icon: GithubSVG, color: 'from-gray-500 to-gray-600', label: '查看我的GitHub' },
		{ name: 'Bilibili', url: 'https://bilibili.com', icon: BilibiliSVG, color: 'from-pink-500 to-purple-500', label: '访问我的B站' },
		{ name: 'CSDN', url: 'https://csdn.net', icon: JuejinSVG, color: 'from-orange-500 to-red-500', label: '访问我的CSDN' },
		{ name: 'QQ邮箱', url: 'mailto:209915224@qq.com', icon: MailSVG, color: 'from-blue-500 to-cyan-500', label: '发送邮件' },
	]

	const skills = ['C/C++', 'Python', 'STM32', 'DSP', 'OpenCV', 'ROS', 'Linux', 'PLC']

	const projects = [
		{ name: '机械臂工程车', desc: '基于STM32的智能机械臂控制系统', stars: 42, url: '#' },
		{ name: '自动行驶小车', desc: 'MSP430单片机控制的自动循迹小车', stars: 89, url: '#' },
		{ name: '指纹模块开发', desc: '基于TM1026M指纹模块的上位机系统', stars: 23, url: '#' },
		{ name: '工程车云台', desc: 'OpenMV视觉识别与云台控制', stars: 156, url: '#' },
	]

	const contributions = [0, 2, 5, 3, 1, 4, 6, 2, 3, 5, 4, 2, 1, 3, 5, 7, 4, 2, 1, 3, 4, 6, 2, 3, 5, 1, 2, 4, 3, 5]

	return (
		<>
			<div className='flex flex-col items-center px-6 pt-24 pb-16 max-sm:px-4'>
				<div className='w-full max-w-5xl'>
					{isEditMode ? (
						isPreviewMode ? (
							<div className='space-y-6'>
								<div className='text-center'>
									<h1 className='mb-4 text-4xl font-bold'>{data.title || '标题预览'}</h1>
									<p className='text-secondary text-lg'>{data.description || '描述预览'}</p>
								</div>
								{loading ? (
									<div className='text-secondary text-center'>预览渲染中...</div>
								) : (
									<div className='card relative p-6'>
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
								<div className='card relative'>
									<textarea
										placeholder='Markdown 内容'
										className='min-h-[500px] w-full resize-none text-sm'
										value={data.content}
										onChange={e => setData({ ...data, content: e.target.value })}
									/>
								</div>
							</div>
						)
					) : (
						<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
							<motion.aside
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
								className='lg:col-span-4'
							>
								<div className='space-y-6'>
									<motion.div
										whileHover={{ scale: 1.02 }}
										className='relative overflow-hidden rounded-2xl border border-purple-500/20 bg-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10'
									>
										<div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10' />
										<div className='absolute top-0 right-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl' />
										<div className='relative p-6'>
											<div className='flex flex-col items-center'>
												<div className='relative mb-4'>
													<div className='h-32 w-32 overflow-hidden rounded-full border-3 border-purple-500/40 shadow-lg shadow-purple-500/30'>
														<img
															src='https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=anime%20style%20professional%20developer%20portrait%20purple%20theme%20avatar&image_size=square'
															alt='Avatar'
															className='h-full w-full object-cover'
														/>
													</div>
													<div className='absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-green-500 p-2 shadow-lg animate-pulse'>
														<div className='h-3 w-3 rounded-full bg-white' />
													</div>
												</div>
												<h2 className='text-2xl font-bold text-white'>{data.title}</h2>
												<p className='text-purple-300/80 text-sm'>{data.description}</p>
												<div className='mt-4 flex gap-2'>
													<motion.a
														href='mailto:example@email.com'
														whileHover={{ scale: 1.05, y: -2 }}
														className='flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-300 backdrop-blur-md transition-all hover:bg-purple-500/40'
													>
														<MailSVG className='h-5 w-5' />
													</motion.a>
													<motion.a
														href='https://github.com'
														target='_blank'
														rel='noreferrer'
														whileHover={{ scale: 1.05, y: -2 }}
														className='flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-300 backdrop-blur-md transition-all hover:bg-purple-500/40'
													>
														<GithubSVG className='h-5 w-5' />
													</motion.a>
												</div>
											</div>
										</div>
									</motion.div>

									<div className='rounded-xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-5'>
										<h3 className='mb-4 text-sm font-medium text-purple-300'>社交平台</h3>
										<div className='space-y-2'>
											{socialLinks.map((social, index) => {
												const IconComponent = social.icon
												return (
													<motion.a
														key={social.name}
														href={social.url}
														target='_blank'
														rel='noreferrer'
														initial={{ opacity: 0, x: -10 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ delay: index * 0.1 }}
														whileHover={{ x: 5, scale: 1.02 }}
														onMouseEnter={() => setActiveSocial(social.name)}
														onMouseLeave={() => setActiveSocial(null)}
														className={`flex items-center gap-3 rounded-lg border border-purple-500/10 bg-white/5 p-3 transition-all ${
															activeSocial === social.name
																? 'border-purple-500/40 bg-purple-500/10'
																: 'hover:border-purple-500/30 hover:bg-white/10'
														}`}
													>
														<div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${social.color} p-2`}>
															<IconComponent className='h-full w-full' />
														</div>
														<div className='flex-1'>
															<div className='text-sm font-medium text-white'>{social.name}</div>
															<div className='text-xs text-purple-400/60'>{social.label}</div>
														</div>
														<motion.div
															initial={{ x: 0 }}
															animate={{ x: activeSocial === social.name ? 5 : 0 }}
															className='text-purple-400'
														>
															→
														</motion.div>
													</motion.a>
												)
											})}
										</div>
									</div>

									<div className='rounded-xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-5'>
										<h3 className='mb-4 text-sm font-medium text-purple-300'>技术栈</h3>
										<div className='flex flex-wrap gap-2'>
											{skills.map((skill, index) => (
												<motion.span
													key={skill}
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ delay: index * 0.05 }}
													whileHover={{ scale: 1.1, y: -2 }}
													className='rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 text-xs font-medium text-purple-200 cursor-default'
												>
													{skill}
												</motion.span>
											))}
										</div>
									</div>

									<div className='rounded-xl border border-purple-500/20 bg-white/5 backdrop-blur-md p-5'>
										<h3 className='mb-4 text-sm font-medium text-purple-300'>GitHub 活动</h3>
										<div className='flex items-end justify-between gap-0.5 h-24'>
											{contributions.map((count, index) => (
												<motion.div
													key={index}
													initial={{ height: 0 }}
													animate={{ height: `${Math.max(count * 6, 4)}px` }}
													transition={{ delay: index * 0.02, duration: 0.3 }}
													whileHover={{ scaleY: 1.1 }}
													className='flex-1 rounded-t-sm bg-gradient-to-t from-purple-500/60 to-pink-500/40 cursor-pointer hover:from-purple-400/80 hover:to-pink-400/60'
													title={`${count} contributions`}
												/>
											))}
										</div>
										<div className='mt-2 flex justify-between text-[10px] text-purple-400/50'>
											<span>1月</span>
											<span>12月</span>
										</div>
									</div>
								</div>
							</motion.aside>

							<motion.main
								initial={{ opacity: 0, x: 30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className='lg:col-span-8 space-y-6'
							>
								<div className='relative overflow-hidden rounded-2xl border border-purple-500/20 bg-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10'>
									<div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5' />
									<div className='relative p-8'>
										<h2 className='mb-4 text-2xl font-bold text-white'>个人介绍</h2>
										{loading ? (
											<div className='flex items-center justify-center py-8'>
												<div className='h-8 w-8 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500' />
											</div>
										) : (
											<div className='prose prose-lg max-w-none prose-purple'>
												{content}
											</div>
										)}
									</div>
								</div>

								<div className='relative overflow-hidden rounded-2xl border border-purple-500/20 bg-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10'>
									<div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5' />
									<div className='relative p-6'>
										<h2 className='mb-4 text-xl font-bold text-white'>最近项目</h2>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
											{projects.map((project, index) => (
												<motion.a
													key={project.name}
													href={project.url}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
													whileHover={{ y: -5 }}
													className='group rounded-xl border border-purple-500/10 bg-white/5 p-4 transition-all hover:border-purple-500/30 hover:bg-white/10 cursor-pointer'
												>
													<div className='flex items-start justify-between'>
														<div>
															<h3 className='font-medium text-white group-hover:text-purple-300 transition-colors'>
																{project.name}
															</h3>
															<p className='mt-1 text-sm text-purple-400/60'>{project.desc}</p>
														</div>
														<div className='rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300'>
															⭐ {project.stars}
														</div>
													</div>
													<motion.div
														initial={{ width: 0 }}
														whileHover={{ width: '100%' }}
														className='mt-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500'
													/>
												</motion.a>
											))}
										</div>
									</div>
								</div>

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className='text-center'
								>
									<p className='text-purple-400/60 text-sm'>
										感谢你的访问，期待与你交流！
									</p>
									<LikeButton slug='about' delay={0} className='inline-block mt-4' />
								</motion.div>
							</motion.main>
						</div>
					)}
				</div>
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
							className='rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm text-purple-200 backdrop-blur-md hover:bg-purple-500/20'
						>
							取消
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsPreviewMode(prev => !prev)}
							disabled={isSaving}
							className='rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm text-purple-200 backdrop-blur-md hover:bg-purple-500/20'
						>
							{isPreviewMode ? '继续编辑' : '预览'}
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleSaveClick}
							disabled={isSaving}
							className='rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
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
							className='rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-2 text-sm text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20'
						>
							编辑
						</motion.button>
					)
				)}
			</motion.div>
		</>
	)
}