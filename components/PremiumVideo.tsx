'use client'

import { useState } from 'react'

// The 60-second Premium explainer for agency owners. Provider-facing pages
// only (/premium, /providers): families are most of the site's traffic and
// this is a sales pitch to agencies, so it never goes on family pages.
// Plays from YouTube so the views count toward the channel. The poster is a
// local image and the YouTube player only loads on tap, so the page stays light.
const YOUTUBE_ID = 'mZ26Wrtdphw'

export function PremiumVideo() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="How GAPP agencies in Georgia get more cases"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label="Play the one-minute video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/videos/premium-60s-poster.jpg" alt="" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 shadow-xl group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-gray-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 text-center mt-3">
        One minute: how families find GeorgiaGAPP.com, and what Premium does for your agency.
      </p>
    </div>
  )
}
