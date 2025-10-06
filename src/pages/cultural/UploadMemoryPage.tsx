import { useState, useRef } from 'react'
import { ArrowLeft, Mic, Upload, Save, FileAudio, Image as ImageIcon } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'

export default function UploadMemoryPage() {
  const navigate = useNavigate()
  const [mediaType, setMediaType] = useState<'audio' | 'image'>('audio')
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const startRecording = () => setIsRecording(true)
  const stopRecording = () => setIsRecording(false)

  const onPick = () => fileRef.current?.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return
    if (mediaType === 'audio') setAudioFile(files[0])
    else setImageFiles([...imageFiles, ...Array.from(files)])
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <form className="space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ancestor-dark">Memory Media</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='audio' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMediaType('audio')}>Audio</span>
              <span className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='image' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMediaType('image')}>Image</span>
            </div>
          </div>

          {mediaType === 'audio' ? (
            <div className="text-center">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 mx-auto flex items-center justify-center mb-4">
                {audioFile ? <FileAudio className="w-10 h-10 text-ancestor-primary" /> : <Mic className="w-10 h-10 text-ancestor-primary" />}
              </div>
              <div className="flex items-center justify-center gap-3">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex items-center gap-2"><Mic className="w-4 h-4" /> Record</Button>
                ) : (
                  <Button onClick={stopRecording} className="flex items-center gap-2"><Mic className="w-4 h-4" /> Stop</Button>
                )}
                <Button variant="outline" onClick={onPick} className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload File</Button>
                <input type="file" accept="audio/*" ref={fileRef} onChange={onFile} className="hidden" />
              </div>
              {audioFile && <p className="text-sm text-gray-600 mt-3">Selected: {audioFile.name}</p>}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-full rounded-xl bg-gray-100 mx-auto overflow-hidden mb-4 p-4">
                {imageFiles.length ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imageFiles.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={`img-${i}`} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-gray-400"><ImageIcon className="w-10 h-10" /></div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={onPick} className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Images</Button>
                <input type="file" accept="image/*" ref={fileRef} onChange={onFile} className="hidden" multiple />
              </div>
              {imageFiles.length > 0 && <p className="text-sm text-gray-600 mt-3">Selected: {imageFiles.length} image(s)</p>}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Memory Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input className="input-field" placeholder="Give this memory a title" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select className="input-field" required>
                <option value="">Select category</option>
                <option>Ceremony</option>
                <option>Daily Life</option>
                <option>Migration</option>
                <option>Folklore</option>
                <option>Food</option>
                <option>Music</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea className="input-field resize-none" rows={4} placeholder="Provide context, background information, or a summary..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input className="input-field" placeholder="e.g., 1991" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input className="input-field" placeholder="Where was this recorded?" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
              <input className="input-field" placeholder="e.g., Grandmother, Aunt Ngozi" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input className="input-field" placeholder="Add comma-separated keywords" />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/cultural-memories')}>Cancel</Button>
          <Button className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Memory</Button>
        </div>
      </form>
    </div>
  )
}