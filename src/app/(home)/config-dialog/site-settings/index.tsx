'use client'

import type { SiteContent } from '../../stores/config-store'
import { SiteMetaForm } from './site-meta-form'
import { SocialButtonsSection } from './social-buttons-section'
import { HatSection } from './hat-section'
import { BeianForm } from './beian-form'

export function SiteSettings({
	formData,
	setFormData
}: {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}) {
	return (
		<div className='space-y-6'>

			<SiteMetaForm formData={formData} setFormData={setFormData} />

			<BeianForm formData={formData} setFormData={setFormData} />

			<SocialButtonsSection
				formData={formData}
				setFormData={setFormData}
			/>

			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.clockShowSeconds ?? false}
						onChange={e => setFormData({ ...formData, clockShowSeconds: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>时钟显示秒数</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.summaryInContent ?? false}
						onChange={e => setFormData({ ...formData, summaryInContent: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>摘要放入内容</span>
				</label>

				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.hideEditButton ?? false}
						onChange={e => setFormData({ ...formData, hideEditButton: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>隐藏编辑按钮（编辑快捷键 ctrl/cmd + ,）</span>
				</label>
			</div>
			<div className='flex gap-3'>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.isCachePem ?? false}
						onChange={e => setFormData({ ...formData, isCachePem: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>缓存PEM(已加密，但存在风险)</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableCategories ?? false}
						onChange={e => setFormData({ ...formData, enableCategories: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>启用文章分类</span>
				</label>
				<label className='flex items-center gap-2'>
					<input
						type='checkbox'
						checked={formData.enableChristmas ?? false}
						onChange={e => setFormData({ ...formData, enableChristmas: e.target.checked })}
						className='accent-brand h-4 w-4 rounded'
					/>
					<span className='text-sm font-medium'>开启圣诞节</span>
				</label>
			</div>

			<HatSection formData={formData} setFormData={setFormData} />
		</div>
	)
}
