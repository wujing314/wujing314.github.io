import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/local-storage'
import { toast } from 'sonner'

const TODO_KEY = 'diary_todos'

export interface TodoItem {
	id: string
	text: string
	completed: boolean
	createdAt: string
}

export async function getTodos(): Promise<TodoItem[]> {
	return loadFromLocalStorage<TodoItem[]>(TODO_KEY, [])
}

export async function addTodo(text: string): Promise<void> {
	const todos = await getTodos()
	const newTodo: TodoItem = {
		id: `todo_${Date.now()}`,
		text,
		completed: false,
		createdAt: new Date().toISOString()
	}
	todos.unshift(newTodo)
	saveToLocalStorage(TODO_KEY, todos)
	toast.success('添加成功')
}

export async function toggleTodo(id: string): Promise<void> {
	const todos = await getTodos()
	const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
	saveToLocalStorage(TODO_KEY, updated)
}

export async function deleteTodo(id: string): Promise<void> {
	const todos = await getTodos()
	const filtered = todos.filter(t => t.id !== id)
	saveToLocalStorage(TODO_KEY, filtered)
	toast.success('删除成功')
}

export async function clearCompleted(): Promise<void> {
	const todos = await getTodos()
	const active = todos.filter(t => !t.completed)
	saveToLocalStorage(TODO_KEY, active)
	toast.success('已清除已完成项')
}