import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Play, Calendar, User, MapPin, MoreHorizontal, SlidersHorizontal, Image as ImageIcon, Headphones } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

type MediaType = 'audio' | 'image'

interface MemoryItem {
  id: number
  title: string
  description: string
  uploadedBy: string
  uploadDate: string
  location: string
  category: string
  type: MediaType
  duration?: string
  imageUrl?: string
  images?: string[]
  tags: string[]
}

const MOCK: MemoryItem[] = [
  { id: 1, title: 'The Naming Ceremony', description: 'Grandmother recounts a traditional naming rite in Enugu.', duration: '12:45', uploadedBy: 'Ada Obi', uploadDate: 'Jan 12, 2024', location: 'Enugu, Nigeria', category: 'Ceremony', type: 'audio', tags: ['Naming', 'Tradition'] },
  { id: 2, title: 'Market Days', description: 'Photos from the old market square and communal gatherings.', uploadedBy: 'Sola Ade', uploadDate: 'Dec 29, 2023', location: 'Ibadan, Nigeria', category: 'Daily Life', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1558980664-10e7170b5c78?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1527152832251-5d0cc97b38b7?q=80&w=1200&auto=format&fit=crop'], tags: ['Market', 'Community'] },
  { id: 3, title: 'Migration West', description: 'Father shares the 80s migration journey across states.', duration: '18:03', uploadedBy: 'Chinedu N.', uploadDate: 'Nov 3, 2023', location: 'Lagos, Nigeria', category: 'Migration', type: 'audio', tags: ['Journey'] },
  { id: 4, title: 'Wedding Portrait 1978', description: 'Family wedding photo highlighting traditional attire.', uploadedBy: 'Ngozi U.', uploadDate: 'Oct 7, 2023', location: 'Enugu, Nigeria', category: 'Ceremony', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop'], tags: ['Wedding', 'Attire'] },
]

export default function CulturalMemoriesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = ['All', 'Ceremony', 'Daily Life', 'Migration', 'Folklore', 'Food', 'Music']

  const filtered = MOCK.filter(m =>
    (category && category !== 'All' ? m.category === category : true) &&
    (search ? (m.title + m.description).toLowerCase().includes(search.toLowerCase()) : true)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark">Cultural Memories</h1>
          <p className="text-gray-600">Preserve and explore your family’s oral traditions and visual memories</p>
        </div>
        <Link to="/upload-memory">
          <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Upload Memory</Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memories..." className="input-field pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-sm border ${category === c || (!category && c==='All') ? 'bg-ancestor-light text-ancestor-primary border-ancestor-primary' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(m => (
          <Card key={m.id} className="hover:shadow-lg transition-shadow">
            {/* Media preview */}
            {m.type === 'audio' ? (
              <div className="aspect-video rounded-lg bg-gradient-to-br from-ancestor-primary/10 to-ancestor-secondary/10 flex items-center justify-center relative">
                <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition">
                  <Play className="w-6 h-6 text-ancestor-primary" />
                </button>
                {m.duration && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs">{m.duration}</div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white text-ancestor-primary text-xs inline-flex items-center gap-1"><Headphones className="w-3 h-3" /> Audio</span>
              </div>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white text-ancestor-primary text-xs inline-flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</span>
              </div>
            )}

            {/* Info */}
            <div className="mt-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ancestor-dark line-clamp-2">{m.title}</h3>
                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m.description}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {m.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary text-xs">{t}</span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
                <div className="flex items-center"><User className="w-3 h-3 mr-1" /> {m.uploadedBy}</div>
                <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {m.location}</div>
                <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {m.uploadDate}</div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link to={`/cultural-memories/${m.id}`} state={{ memory: m }} className="flex-1">
                  <Button variant="outline" className="w-full">{m.type === 'audio' ? 'Listen' : 'View'}</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}