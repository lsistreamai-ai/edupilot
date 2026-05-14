export interface User {
  id: string
  email: string
  name: string
  role: 'teacher' | 'student'
  grade?: string
  subjects?: string[]
  school?: string
  created_at: string
}
