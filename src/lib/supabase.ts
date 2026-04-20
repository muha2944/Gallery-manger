import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Folder {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Image {
  id: string
  folder_id: string
  name: string
  url: string
  created_at: string
}
