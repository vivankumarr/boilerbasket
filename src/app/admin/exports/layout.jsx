import { checkAdminAccess } from "@/lib/supabase/checkAdmin"

export default async function ExportsLayout({ children }) {
  await checkAdminAccess()
  
  return <>{children}</>
}