interface ProfileFooterProps {
  providerName: string
  city: string
}

export function ProfileFooter({ providerName, city }: ProfileFooterProps) {
  return (
    <footer className="bg-navy py-8 px-6 text-center">
      <div className="text-sm font-bold text-white/80">{providerName}</div>
      <div className="text-xs text-white/50 mt-1">GAPP-approved provider in {city}, Georgia</div>
    </footer>
  )
}
