import { config } from '@/lib/config'
import { TrackableLink } from '@/components/TrackableLink'

// Phone-only bar pinned to the bottom of the screen so the number is always
// one tap away while the family scrolls. Hidden on wider screens and in print.
export function StickyCallBar({ providerId }: { providerId?: string }) {
  const cls = 'flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white text-lg font-extrabold rounded-xl shadow-md'
  const tel = `tel:${config.contact.phoneRaw}`
  return (
    <div className="sm:hidden print:hidden fixed inset-x-0 bottom-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-gray-200">
      {providerId ? (
        <TrackableLink href={tel} providerId={providerId} eventType="click_helpline" className={cls}>
          Call {config.contact.phone}
        </TrackableLink>
      ) : (
        <a href={tel} className={cls}>Call {config.contact.phone}</a>
      )}
    </div>
  )
}
