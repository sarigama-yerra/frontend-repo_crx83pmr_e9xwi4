import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-xl shadow p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function CreateStudent({ onCreated }) {
  const [form, setForm] = useState({ roll_no: '', name: '', email: '' })
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setForm({ roll_no: '', name: '', email: '' })
      onCreated && onCreated()
    }
  }
  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <input className="input" placeholder="Roll No" value={form.roll_no} onChange={e=>setForm({...form, roll_no:e.target.value})} />
      <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <button className="btn">Add</button>
    </form>
  )
}

function List({ url, columns }) {
  const [items, setItems] = useState([])
  const load = async () => {
    const r = await fetch(`${API_BASE}${url}`)
    const j = await r.json()
    setItems(j.items || [])
  }
  useEffect(()=>{ load() },[])
  return (
    <div>
      <button onClick={load} className="text-sm text-blue-600 mb-2">Refresh</button>
      <div className="overflow-auto max-h-64">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              {columns.map(c=> <th key={c} className="pr-4 py-1">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx)=> (
              <tr key={idx} className="border-t">
                {columns.map(c=> <td key={c} className="pr-4 py-1">{String(it[c] ?? '')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnalyzeComplaint() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const analyze = async () => {
    const r = await fetch(`${API_BASE}/api/complaints/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description })
    })
    setResult(await r.json())
  }
  return (
    <div className="space-y-2">
      <input className="input" placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
      <textarea className="input h-24" placeholder="Describe the complaint" value={description} onChange={e=>setDescription(e.target.value)} />
      <button className="btn" onClick={analyze}>Analyze</button>
      {result && (
        <div className="text-sm text-gray-700">
          <div>Sentiment: <b>{result.sentiment}</b></div>
          <div>Category: <b>{result.category || 'n/a'}</b></div>
          <div>Severity: <b>{result.severity}</b></div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hostel Management System</h1>
          <div className="text-gray-600 text-sm">AI-assisted complaint analysis</div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Create Student">
            <CreateStudent onCreated={()=>{}} />
          </Section>
          <Section title="Students">
            <List url="/api/students" columns={["roll_no","name","email"]} />
          </Section>

          <Section title="Rooms">
            <List url="/api/rooms" columns={["number","capacity","floor","type"]} />
          </Section>
          <Section title="Allocations">
            <List url="/api/allocations" columns={["student_roll_no","room_number","start_date","end_date","status"]} />
          </Section>

          <Section title="Visitors">
            <List url="/api/visitors" columns={["name","visiting_student_roll_no","purpose","in_time","out_time"]} />
          </Section>
          <Section title="Complaints Analyzer">
            <AnalyzeComplaint />
          </Section>
        </div>
      </div>

      <style>
        {`
          .btn{ @apply bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-2 rounded-lg transition; }
          .input{ @apply w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200; }
        `}
      </style>
    </div>
  )
}

export default App
