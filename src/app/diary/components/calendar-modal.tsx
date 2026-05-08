'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { DialogModal } from '@/components/dialog-modal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'

interface CalendarModalProps {
	open: boolean
	onClose: () => void
	onSelectDate: (date: string) => void
	existingDates: string[]
}

export function CalendarModal({ open, onClose, onSelectDate, existingDates }: CalendarModalProps) {
	const [currentDate, setCurrentDate] = useState(dayjs())
	
	const existingDateSet = new Set(existingDates)

	const year = currentDate.year()
	const month = currentDate.month()
	
	const firstDay = currentDate.startOf('month').day()
	const daysInMonth = currentDate.daysInMonth()
	
	const prevMonth = () => {
		setCurrentDate(currentDate.subtract(1, 'month'))
	}
	
	const nextMonth = () => {
		setCurrentDate(currentDate.add(1, 'month'))
	}
	
	const today = dayjs().format('YYYY-MM-DD')
	
	const handleDateClick = (day: number) => {
		const selected = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
		onSelectDate(selected.format('YYYY-MM-DD'))
		onClose()
	}
	
	const weekDays = ['日', '一', '二', '三', '四', '五', '六']
	
	const days = []
	for (let i = 0; i < firstDay; i++) {
		days.push(<div key={`empty-${i}`} className='h-10' />)
	}
	
	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		const hasDiary = existingDateSet.has(dateStr)
		const isToday = dateStr === today
		
		days.push(
			<motion.button
				key={day}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => handleDateClick(day)}
				className={`
					h-10 w-10 rounded-lg text-sm font-medium transition-colors
					${isToday ? 'bg-brand text-white' : ''}
					${hasDiary && !isToday ? 'bg-brand/10 text-brand' : ''}
					${!hasDiary && !isToday ? 'hover:bg-gray-100 text-gray-700' : ''}
				`}
			>
				{day}
			</motion.button>
		)
	}

	return (
		<DialogModal open={open} onClose={onClose} className='card backdrop-blur-sm w-[320px]'>
			<div className='mb-4 flex items-center justify-between'>
				<div className='text-lg font-medium'>
					{year}年{month + 1}月
				</div>
				<div className='flex gap-2'>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={prevMonth}
						className='rounded-lg p-1 hover:bg-gray-100'
					>
						<ChevronLeft className='h-5 w-5' />
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={nextMonth}
						className='rounded-lg p-1 hover:bg-gray-100'
					>
						<ChevronRight className='h-5 w-5' />
					</motion.button>
				</div>
			</div>
			
			<div className='grid grid-cols-7 gap-1 text-center'>
				{weekDays.map(day => (
					<div key={day} className='h-8 text-sm text-gray-500'>
						{day}
					</div>
				))}
				{days}
			</div>
			
			<div className='mt-4 text-center text-xs text-gray-400'>
				有日记的日期已高亮显示
			</div>
		</DialogModal>
	)
}