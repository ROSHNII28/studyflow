// src/Planner.jsx
import { useEffect, useState } from 'react'
import { addTask, deleteTask, getTasks, toggleTask, updateTask } from './plannerService'
import { useToast } from './ToastContext'

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'Art', 'Other']
const PRIORITIES = ['Low', 'Medium', 'High']

export default function Planner() {
  const toast = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', subject: '', time: '', duration: '60', priority: 'Medium', notes: '' })
  const [tasks, setTasks] = useState([])

  // Load tasks for selectedDate
  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks(selectedDate)
        setTasks(data)
      } catch (err) {
        toast('Error fetching tasks', 'error')
        console.error(err)
      }
    }
    fetchTasks()
  }, [selectedDate])

  // Calendar helpers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date().toISOString().split('T')[0]

  const calDays = []
  for (let i = 0; i < firstDay; i++) calDays.push({ date: '', day: '', otherMonth: true })
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    calDays.push({ date: d.toISOString().split('T')[0], day: i, otherMonth: false })
  }
  while (calDays.length < 42) calDays.push({ date: '', day: '', otherMonth: true })

  function openAdd() {
    setEditTask(null)
    setForm({ title: '', subject: '', time: '', duration: '60', priority: 'Medium', notes: '' })
    setShowModal(true)
  }

  function openEdit(task) {
    setEditTask(task)
    setForm({ ...task })
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!form.title.trim()) return
    try {
      if (editTask) {
        await updateTask(editTask.id, { ...form, date: selectedDate })
        setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...form } : t))
        toast('Task updated ✓', 'success')
      } else {
        const docRef = await addTask({ ...form, date: selectedDate })
        setTasks(prev => [...prev, { ...form, id: docRef.id }])
        toast('Task added ✓', 'success')
      }
      setShowModal(false)
    } catch (err) {
      toast('Error saving task', 'error')
      console.error(err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      toast('Task deleted')
    } catch (err) {
      toast('Error deleting task', 'error')
      console.error(err)
    }
  }

  async function handleToggle(task) {
    try {
      await toggleTask(task.id, !task.completed)
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
    } catch (err) {
      toast('Error updating task', 'error')
      console.error(err)
    }
  }

  const monthStr = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const selectedStr = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Planner</h1>
          <p className="page-subtitle">Organize your study sessions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Calendar */}
        <div className="card-white">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setCurrentDate(new Date(year, month - 1))}>‹</button>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{monthStr}</span>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setCurrentDate(new Date(year, month + 1))}>›</button>
          </div>

          <div className="calendar-grid">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="cal-header">{d}</div>)}
            {calDays.map((d,i) => {
              const isToday = d.date === today
              const isSelected = d.date === selectedDate
              const hasTasks = tasks.some(t => t.date === d.date)
              return (
                <div key={i} className={`cal-day${d.otherMonth ? ' other-month' : ''}${isToday ? ' today' : ''}${isSelected && !isToday ? ' selected' : ''}`} onClick={() => d.date && setSelectedDate(d.date)}>
                  {d.day}
                  {hasTasks && <div className="cal-dot" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="card-white">
          <div className="section-header">
            <span className="section-title">{selectedStr}</span>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Task</button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-text">No tasks for this day</div>
              <button className="btn btn-primary btn-sm" onClick={openAdd}>Schedule a Session</button>
            </div>
          ) : tasks.map(task => (
            <div key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
              <div className={`task-checkbox${task.completed ? ' checked' : ''}`} onClick={() => handleToggle(task)}>{task.completed && <span style={{ color:'white', fontSize:'10px' }}>✓</span>}</div>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  {task.time && <span>⏰ {task.time}</span>}
                  {task.duration && <span>⏱ {task.duration} min</span>}
                  {task.subject && <span className="badge badge-green">{task.subject}</span>}
                  {task.priority && task.priority !== 'Medium' && <span className={`badge badge-${task.priority === 'High' ? 'red':'blue'}`}>{task.priority}</span>}
                </div>
                {task.notes && <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{task.notes}</p>}
              </div>
              <div className="task-actions">
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => openEdit(task)}>✎</button>
                <button className="btn btn-icon btn-danger btn-sm" onClick={() => handleDelete(task.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editTask ? 'Edit Task' : 'Add Study Task'}</h3>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Task Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}/>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Subject</label>
                <select className="form-select" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}>
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select className="form-select" value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Time</label>
                <input type="time" className="form-input" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))}/>
              </div>
              <div className="form-group">
                <label>Duration (min)</label>
                <input type="number" className="form-input" value={form.duration} min="15" step="15" onChange={e => setForm(f => ({...f, duration: e.target.value}))}/>
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-textarea" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}/>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editTask ? 'Save Changes' : 'Add Task'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}