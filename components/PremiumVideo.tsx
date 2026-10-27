// The 60-second Premium explainer for agency owners. Provider-facing pages
// only (/premium, /providers): families are most of the site's traffic and
// this is a sales pitch to agencies, so it never goes on family pages.
// The file is self-hosted in public/videos; no autoplay, sound on tap.
export function PremiumVideo() {
  return (
    <div className="max-w-3xl mx-auto">
      <video
        className="w-full rounded-2xl shadow-lg bg-gray-100"
        controls
        playsInline
        preload="metadata"
        poster="/videos/premium-60s-poster.jpg"
      >
        <source src="/videos/premium-60s.mp4" type="video/mp4" />
      </video>
      <p className="text-sm text-gray-500 text-center mt-3">
        One minute: how families find GeorgiaGAPP.com, and what Premium does for your agency.
      </p>
    </div>
  )
}
