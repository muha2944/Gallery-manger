import Link from 'next/link'
import { supabase, Folder } from '@/lib/supabase'
import { Folder as FolderIcon, ArrowLeft } from 'lucide-react'

async function getFolders(): Promise<Folder[]> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching folders:', error)
    return []
  }

  return data || []
}

export default async function GalleryPage() {
  const folders = await getFolders()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="glass rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-300 uppercase tracking-wide">
                    Gallery Manager
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                  <span className="gradient-text">Explore</span>
                  <br />
                  <span className="text-white">Your Collections</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
                  Discover and manage your visual collections with our professional gallery interface.
                  Built with modern web technologies for the best user experience.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{folders.length}</div>
                    <div className="text-sm text-slate-400">Collections</div>
                  </div>
                  <div className="px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-blue-400">∞</div>
                    <div className="text-sm text-slate-400">Images</div>
                  </div>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl absolute -inset-4"></div>
                  <div className="relative w-80 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderIcon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-white font-semibold">Professional Gallery</div>
                      <div className="text-slate-400 text-sm">Next.js + Supabase</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Collections</h2>
            <div className="text-sm text-slate-400">
              {folders.length} collection{folders.length === 1 ? '' : 's'}
            </div>
          </div>
          <Link href="/gallery/new" className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold">
            Add Folder
          </Link>
        </div>

        {folders.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Collections Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Start building your gallery by creating your first collection. Add folders and upload images to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Collections</h2>
              <div className="text-sm text-slate-400">
                {folders.length} collection{folders.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {folders.map((folder, index) => (
                <Link
                  key={folder.id}
                  href={`/gallery/${folder.slug}`}
                  className="group block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-hover glass rounded-3xl p-8 h-full border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FolderIcon className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-blue-400 rotate-180" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                        {folder.name}
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Browse and manage images in this collection
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>View Collection</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
