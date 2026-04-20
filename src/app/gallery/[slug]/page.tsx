import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase, Folder, Image as ImageType } from '@/lib/supabase'
import { ArrowLeft, Folder as FolderIcon, UploadCloud } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

function isValidUrl(url: string) {
  if (!url) return false

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function getFolderWithImages(slug: string): Promise<{
  folder: Folder | null
  images: ImageType[]
}> {
  // Get folder by slug
  const { data: folder, error: folderError } = await supabase
    .from('folders')
    .select('*')
    .eq('slug', slug)
    .single()

  if (folderError || !folder) {
    return { folder: null, images: [] }
  }

  // Get images for this folder
  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('*')
    .eq('folder_id', folder.id)
    .order('name')

  if (imagesError) {
    console.error('Error fetching images:', imagesError)
    return { folder, images: [] }
  }

  return { folder, images: images || [] }
}

export default async function FolderPage({ params }: PageProps) {
  const { slug } = await params
  const { folder, images } = await getFolderWithImages(slug)

  if (!folder) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <section className="mb-16">
          <div className="glass rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 hover:border-blue-500/30 transition-all duration-300 mb-8 group"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-slate-300 group-hover:text-white font-medium">Back to Collections</span>
                </Link>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                    <FolderIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      <span className="gradient-text">{folder.name}</span>
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
                  {images.length} image{images.length === 1 ? '' : 's'} in this collection.
                  Browse and manage your visual content with our professional interface.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{images.length}</div>
                    <div className="text-sm text-slate-400">Images</div>
                  </div>
                  <div className="px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="text-2xl font-bold text-green-400">✓</div>
                    <div className="text-sm text-slate-400">Optimized</div>
                  </div>
                  <Link
                    href={`/gallery/${folder.slug}/upload`}
                    className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Add Image
                  </Link>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-3xl absolute -inset-4"></div>
                  <div className="relative w-64 h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-white font-semibold text-lg">{folder.name}</div>
                      <div className="text-slate-400 text-sm mt-2">Collection Details</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center">
                <FolderIcon className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Images Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              This collection is empty. Add some images to start building your gallery.
            </p>
            <button className="btn-primary">
              Add Images
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Images</h2>
              <div className="text-sm text-slate-400">
                {images.length} image{images.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="card-hover glass rounded-3xl overflow-hidden border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    {isValidUrl(image.url) ? (
                      <>
                        <Image
                          src={image.url}
                          alt={image.name || 'Gallery image'}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-6">
                        <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold mb-2">Invalid Image URL</div>
                          <div className="text-sm">Unable to load image</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t border-slate-700/50">
                    <h3 className="font-semibold text-white text-lg mb-2 truncate group-hover:text-blue-300 transition-colors duration-300">
                      {image.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Image</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
