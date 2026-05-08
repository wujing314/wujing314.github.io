'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Key, Upload } from 'lucide-react'
import { useAuthStore } from '@/hooks/use-auth'
import { DialogModal } from './dialog-modal'
import { readFileAsText } from '@/lib/file-utils'
import { toast } from 'sonner'

interface LoginModalProps {
	open: boolean
	onClose: () => void
	onSuccess?: () => void
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
	const [isLoading, setIsLoading] = useState(false)
	const { setPrivateKey } = useAuthStore()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleKeyUpload = async (file: File) => {
		try {
			setIsLoading(true)
			const pem = await readFileAsText(file)
			await setPrivateKey(pem)
			toast.success('私钥导入成功，已进入管理员模式')
			onClose()
			onSuccess?.()
		} catch (error) {
			console.error(error)
			toast.error('导入私钥失败，请重试')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<DialogModal
			open={open}
			onClose={onClose}
			className='card backdrop-blur-sm'
		>
			<input
				ref={fileInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handleKeyUpload(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<div className='space-y-6'>
				<div className='text-center'>
					<div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10'>
						<Key className='h-6 w-6 text-brand' />
					</div>
					<h3 className='text-lg font-semibold text-primary'>上传私钥</h3>
					<p className='mt-1 text-sm text-secondary'>上传 GitHub App 私钥以进入管理员模式</p>
				</div>

				<div className='border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand/50 transition-colors cursor-pointer' onClick={() => fileInputRef.current?.click()}>
					<Upload className='mx-auto h-10 w-10 text-gray-400 mb-3' />
					<p className='text-sm text-gray-600'>点击或拖拽上传 .pem 文件</p>
					<p className='text-xs text-gray-400 mt-1'>GitHub App 私钥文件</p>
				</div>

				<div className='bg-blue-50 rounded-xl p-4 text-sm text-blue-700'>
					<p><strong>获取私钥：</strong></p>
					<p className='mt-1'>登录 GitHub → Settings → Developer settings → GitHub Apps → 选择你的 App → Private keys → Generate a private key</p>
				</div>

				<div className='flex justify-end gap-3'>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onClose}
						className='rounded-xl border bg-white/60 px-5 py-2.5 text-sm transition-colors hover:bg-white/80 backdrop-blur-sm'
					>
						取消
					</motion.button>
				</div>
			</div>
		</DialogModal>
	)
}