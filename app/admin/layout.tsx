// Simple admin layout - no sidebar needed for single-page admin
interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>
}