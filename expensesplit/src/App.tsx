// src/App.tsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase';

function App() {
  const [projects, setProjects] = useState<any[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. 讀取資料 (Read)
  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Error fetching:', error)
    else setProjects(data || [])
    setLoading(false)
  }

  // 2. 新增資料 (Create)
  async function createProject() {
    if (!newProjectName) return
    
    const { error } = await supabase
      .from('projects')
      .insert([{ 
        name: newProjectName, 
        home_currency: 'TWD', 
        foreign_currency: 'AUD' 
      }])

    if (error) {
      alert('新增失敗: ' + error.message)
    } else {
      setNewProjectName('')
      fetchProjects() // 重新整理列表
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">資料庫連線測試</h1>
      
      {/* 新增區塊 */}
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          className="border p-2 rounded flex-1"
          placeholder="輸入專案名稱 (如: 澳洲行)"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
        />
        <button 
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新增
        </button>
      </div>

      {/* 列表區塊 */}
      {loading ? (
        <p>載入中...</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(project => (
            <li key={project.id} className="p-3 border rounded shadow-sm flex justify-between">
              <span>{project.name}</span>
              <span className="text-gray-400 text-sm">{project.foreign_currency}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App