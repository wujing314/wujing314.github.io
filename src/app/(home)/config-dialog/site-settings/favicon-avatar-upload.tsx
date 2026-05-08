'use client'

import type { FileItem } from './types'

interface FaviconAvatarUploadProps {
	faviconItem: FileItem | null
	setFaviconItem: React.Dispatch<React.SetStateAction<FileItem | null>>
	avatarItem: FileItem | null
	setAvatarItem: React.Dispatch<React.SetStateAction<FileItem | null>>
}

export function FaviconAvatarUpload({ faviconItem, setFaviconItem, avatarItem, setAvatarItem }: FaviconAvatarUploadProps) {
	return (
		<div className='grid grid-cols-2 gap-4'>
			<div>
				<label className='mb-2 block text-sm font-medium'>Favicon</label>
				<div className='group relative h-20 w-20 overflow-hidden rounded-lg border bg-white/60 opacity-50 cursor-not-allowed'>
					<img src='/favicon.png' alt='current favicon' className='h-full w-full object-cover' />
					<div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
						<span className='text-xs text-white'>上传</span>
					</div>
				</div>
				<p className='mt-1 text-xs text-gray-500'>文件上传已禁用</p>
			</div>

			<div>
				<label className='mb-2 block text-sm font-medium'>头像</label>
				<div className='group relative h-20 w-20 overflow-hidden rounded-full border bg-white/60 opacity-50 cursor-not-allowed'>
					<img src='/images/avatar.png' alt='current avatar' className='h-full w-full object-cover' />
					<div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
						<span className='text-xs text-white'>上传</span>
					</div>
				</div>
				<p className='mt-1 text-xs text-gray-500'>文件上传已禁用</p>
			</div>
		</div>
	)
}