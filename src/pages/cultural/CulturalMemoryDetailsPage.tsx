import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Share2, Download, Calendar, Clock, User, MapPin, Volume2 } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useState } from 'react'

export default function CulturalMemoryDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [playing, setPlaying] = useState(false)

  const memory = {
    id,
    title: 'The Naming Ceremony',
    description: 'Grandmother recounts a traditional naming rite in Enugu. This oral history captures family values and communal identity.',
    uploader: 'Ada Obi',
    uploadDate: 'Jan 12, 2024',
    duration: '12:45',
    category: 'Ceremony',
    location: 'Enugu, Nigeria',
    year: '1991',
    participants: ['Grandmother', 'Aunt Ngozi'],
    tags: ['Naming', 'Tradition', 'Ceremony'],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 aspect-video flex items-center justify-center">
              <button onClick={() => setPlaying(p => !p)} className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition">
                {playing ? <Pause className="w-8 h-8 text-ancestor-primary" /> : <Play className="w-8 h-8 text-ancestor-primary ml-1" />}
              </button>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold text-ancestor-dark">{memory.title}</h1>
              <p className="text-gray-600 mt-2">{memory.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <Button className="flex items-center gap-2"><Download className="w-4 h-4" /> Download</Button>
                <Button variant="outline" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" /> Uploaded by {memory.uploader}</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" /> {memory.uploadDate}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400" /> {memory.duration}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> {memory.location}</div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600"><span className="font-medium text-ancestor-dark">Participants:</span> {memory.participants.join(', ')}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {memory.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary text-xs">{t}</span>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Related Memories</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Volume2 className="w-4 h-4 text-gray-500" /></div>
                <div className="flex-1">
                  <p className="font-medium text-ancestor-dark">Market Days</p>
                  <p className="text-xs text-gray-500">08:21 • Dec 29, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Volume2 className="w-4 h-4 text-gray-500" /></div>
                <div className="flex-1">
                  <p className="font-medium text-ancestor-dark">Migration West</p>
                  <p className="text-xs text-gray-500">18:03 • Nov 3, 2023</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}