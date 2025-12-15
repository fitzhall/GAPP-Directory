import { MemberCardData } from '@/types/member'
import { getTierName, getTierColor } from '@/lib/config'
import { cn } from '@/lib/utils'

interface MemberCardProps {
  member: MemberCardData
}

export function MemberCard({ member }: MemberCardProps) {
  const tierColor = getTierColor(member.tierLevel)
  const tierName = getTierName(member.tierLevel)

  // Card border styling based on tier - modern with subtle elevation
  const getCardBorderClass = () => {
    switch (tierColor) {
      case 'yellow':
        return "border-yellow-200/50 hover:shadow-xl hover:border-yellow-300/50 hover:-translate-y-1"
      case 'purple':
        return "border-purple-200/50 hover:shadow-lg hover:border-purple-300/50 hover:-translate-y-0.5"
      case 'blue':
        return "border-blue-200/50 hover:shadow-lg hover:border-blue-300/50 hover:-translate-y-0.5"
      default:
        return "border-gray-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
    }
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border transition-all duration-300 overflow-hidden group cursor-pointer",
      getCardBorderClass()
    )}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              {member.name}
            </h3>
            {member.companyName && (
              <p className="text-gray-600 mt-1">{member.companyName}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {member.city}, {member.state}
            </p>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {/* Main Tier Badge - Modern pill style with gradients */}
            <span className={cn(
              "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full",
              tierColor === 'yellow'
                ? "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 ring-1 ring-yellow-300/30"
                : tierColor === 'purple'
                ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 ring-1 ring-purple-300/30"
                : tierColor === 'blue'
                ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 ring-1 ring-blue-300/30"
                : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 ring-1 ring-gray-300/30"
            )}>
              {tierName}
            </span>

            {/* Verified Badge */}
            {member.isVerified && (
              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-800 ring-1 ring-green-300/30">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Specializations - Modern tags */}
        {member.specializations && member.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {member.specializations.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200"
              >
                {spec}
              </span>
            ))}
            {member.specializations.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200">
                +{member.specializations.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions - Modern buttons with gradients and animations */}
        <div className="flex gap-3 mt-4">
          <a
            href={`/member/${member.slug}`}
            className={cn(
              "flex-1 inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group-hover:shadow-lg",
              tierColor === 'yellow'
                ? "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800"
                : tierColor === 'purple'
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                : tierColor === 'blue'
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
            )}
          >
            <span>View Profile</span>
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Contact Button */}
          <a
            href="#"
            className={cn(
              "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-all duration-200 shadow-sm",
              tierColor === 'yellow'
                ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400"
                : tierColor === 'purple'
                ? "border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                : tierColor === 'blue'
                ? "border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            )}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </a>
        </div>

        {/* Priority/Featured Indicator */}
        {member.isFeatured && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              ⭐ Featured Member
            </span>
          </div>
        )}
      </div>
    </div>
  )
}