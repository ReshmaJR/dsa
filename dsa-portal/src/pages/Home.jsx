import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard']

export default function Home() {
  const { user, logout } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [topic, setTopic] = useState('All')
  const [setFilter, setSetFilter] = useState('All')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/data/problems.json')
        const data = await res.json()
        setProblems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const topics = useMemo(() => {
    const s = new Set()
    problems.forEach((p) => s.add(p.topic))
    return ['All', ...Array.from(s).sort()]
  }, [problems])

  const sets = useMemo(() => {
    const s = new Set()
    problems.forEach((p) => s.add(p.set))
    return ['All', ...Array.from(s).sort()]
  }, [problems])

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false
      if (topic !== 'All' && p.topic !== topic) return false
      if (setFilter !== 'All' && p.set !== setFilter) return false
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [problems, difficulty, topic, setFilter, query])

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">DSA Portal</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-white/70">{user?.name} · {user?.email}</span>
            <button onClick={logout} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <input
            placeholder="Search by title..."
            className="bg-black/30 border border-white/10 rounded px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="bg-black/30 border border-white/10 rounded px-3 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficultyOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select className="bg-black/30 border border-white/10 rounded px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="bg-black/30 border border-white/10 rounded px-3 py-2" value={setFilter} onChange={(e) => setSetFilter(e.target.value)}>
            {sets.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-white/70">Loading problems…</div>
        ) : (
          <ul className="grid gap-3">
            {filtered.map((p) => (
              <li key={`${p.set}-${p.id}`} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <a className="text-indigo-300 hover:underline font-medium" href={p.url} target="_blank" rel="noreferrer">
                      {p.title}
                    </a>
                    <span className={`text-xs px-2 py-0.5 rounded border ${p.difficulty === 'Easy' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : p.difficulty === 'Medium' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'}`}>{p.difficulty}</span>
                  </div>
                  <div className="text-xs text-white/70 mt-1">{p.topic} · {p.set}</div>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-sm px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500">Open on LeetCode</a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}