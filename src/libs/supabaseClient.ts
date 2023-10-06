import { createClient } from '@supabase/supabase-js'

import { Database } from '@/utils/supabaseTypes'

declare global {
    var supabase: ReturnType<typeof createClient<Database>> | undefined
}

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_PROJECT_URL as string, import.meta.env.VITE_SUPABASE_PROJECT_PUBLIC_ANON_KEY as string)

if (process.env.NODE_ENV !== 'production') {
    globalThis.supabase = supabase
}

export default supabase