'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/hooks/use-auth'
import { DialogModal } from './dialog-modal'

interface LoginModalProps {
	open: boolean
	onClose: () => void
	onSuccess?: () => void
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const { login, isChecking } = useAuthStore()

	const handleLogin = () => {
		if (!password.trim()) {
			return
		}
		if (login(password)) {
			onClose()
			setPassword('')
			onSuccess?.()
		}
	}

	return (
		<DialogModal
			open={open}
			onClose={() => {
				onClose()
				setPassword('')
			}}
			className='card backdrop-blur-sm'
		>
			<div className='space-y-6'>
				<div className='text-center'>
					<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10'>
						<Lock className='h-6 w-6 text-brand' />
					</div>
					<h3 className='text-lg font-semibold text-primary'>请输入密码</h3>
					<p className='mt-1 text-sm text-secondary'>验证身份以访问编辑功能</p>
				</div>

				<div className='relative'>
					<label className='block text-sm font-medium text-gray-700 mb-2'>密码</label>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
						placeholder='请输入管理员密码'
						className='w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all backdrop-blur-sm'
						autoFocus
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
					>
						{showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
					</button>
				</div>

				<div className='flex justify-end gap-3'>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							onClose()
							setPassword('')
						}}
						className='rounded-xl border bg-white/60 px-5 py-2.5 text-sm transition-colors hover:bg-white/80 backdrop-blur-sm'
					>
						取消
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleLogin}
						disabled={!password.trim() || isChecking}
						className='rounded-xl bg-brand px-5 py-2.5 text-sm text-white transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isChecking ? '验证中...' : '登录'}
					</motion.button>
				</div>
			</div>
		</DialogModal>
	)
}