'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function NewFolderPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)
    setSlug(slugify(value))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Folder name is required.')
      return
    }

    setLoading(true)
    const { error: insertError } = await supabase.from('folders').insert([
      {
        name: name.trim(),
        slug: slug || slugify(name),
      },
    ])

    setLoading(false)

    if (insertError) {
      setError(insertError.message || 'Unable to create folder.')
      return
    }

    router.push('/gallery')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-[2rem] border border-slate-700/70 p-10 shadow-2xl shadow-slate-950/40">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Create Folder</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Add a new folder</h1>
              <p className="mt-3 text-slate-400">Create a folder in your gallery and start adding images to it.</p>
            </div>
            <Link
              href="/gallery"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="name">
                Folder name
              </label>
              <input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Example: Vacation photos"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="slug">
                Folder slug
              </label>
              <input
                id="slug"
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                className="w-full rounded-3xl border border-slate-700/80 bg-slate-950 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="vacation-photos"
              />
              <p className="mt-2 text-sm text-slate-500">
                This slug is used in the folder URL. Only lowercase letters, numbers, and hyphens are allowed.
              </p>
            </div>

            {error && <div className="rounded-3xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center"
            >
              {loading ? 'Creating folder...' : 'Create folder'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
