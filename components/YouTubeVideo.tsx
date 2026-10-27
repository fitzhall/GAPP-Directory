'use client'

import { useState } from 'react'

// A YouTube video that loads only on tap. The poster is a local image, so
// the page carries no YouTube script until someone presses play, and every
// play still counts as a view on the GeorgiaGAPP channel.
interface YouTubeVideoProps {
  id: string
  title: string
  poster: string
  caption?: string
}

export function YouTubeVideo({ id, title, poster, caption }: YouTubeVideoProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={`Play: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt="" className="w-full h-full object-cover" />
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
      {caption && <p className="text-sm text-gray-500 text-center mt-3">{caption}</p>}
    </div>
  )
}
