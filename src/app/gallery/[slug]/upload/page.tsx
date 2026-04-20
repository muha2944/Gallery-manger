'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, UploadCloud } from 'lucide-react'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function UploadImagePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { slug } = use(params)
  const [folder, setFolder] = useState<{ id: string; name: string } | null>(null)
  const [imageName, setImageName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFolder() {
      const { data, error: folderError } = await supabase
        .from('folders')
        .select('id, name')
        .eq('slug', slug)
        .single()

      if (folderError || !data) {
        setError('Unable to find folder.')
        return
      }

      setFolder(data)
    }

    loadFolder()
  }, [slug])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
    if (selectedFile && !imageName) {
      setImageName(selectedFile.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!folder) {
      setError('Folder is not loaded yet.')
      return
    }

    if (!imageName.trim()) {
      setError('Image name is required.')
      return
    }

    if (!file && !imageUrl.trim()) {
      setError('Select a file or enter an image URL.')
      return
    }

    setLoading(true)

    let uploadedUrl = imageUrl.trim()

    if (file) {
      const fileName = slugify(imageName) || file.name
      const filePath = `${slug}/${Date.now()}-${fileName}`
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = await supabase.storage.from('images').getPublicUrl(filePath)
      uploadedUrl = publicUrlData.publicUrl
    }

    const { error: insertError } = await supabase.from('images').insert([
      {
        name: imageName.trim(),
        url: uploadedUrl,
        folder_id: folder.id,
      },
    ])

    setLoading(false)

    if (insertError) {
      setError(insertError.message || 'Unable to add image.')
      return
    }

    router.push(`/gallery/${slug}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-[2rem] border border-slate-700/70 p-10 shadow-2xl shadow-slate-950/40">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Upload Image</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                Add an image to <span className="gradient-text">{folder?.name ?? slug}</span>
              </h1>
              <p className="mt-3 text-slate-400">Upload a file or add a remote image URL to store in Supabase.</p>
            </div>
            <Link
              href={`/gallery/${slug}`}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="imageName">
                Image title
              </label>
              <input
                id="imageName"
                value={imageName}
                onChange={(event) => setImageName(event.target.value)}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter image name"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="file">
                  Upload file
                </label>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-5 py-4 text-slate-100 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-2 text-sm text-slate-500">Choose a local image file to upload to Supabase storage.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="imageUrl">
                  Remote image URL
                </label>
                <input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="mt-2 text-sm text-slate-500">Or provide an existing image URL. File upload takes priority.</p>
              </div>
            </div>

            {error && <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saving image...' : 'Save image'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
