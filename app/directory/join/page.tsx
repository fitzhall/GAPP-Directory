import { config } from '@/lib/config'

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Join Our Directory
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Choose Your Membership</h2>

          <div className="space-y-4">
            {config.tiers.map((tier) => (
              <div key={tier.level} className="border rounded-lg p-4 hover:border-primary cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{tier.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {tier.level === 0 && 'Basic listing in directory'}
                      {tier.level === 1 && 'Verified profile with contact info'}
                      {tier.level === 2 && 'Premium listing with priority placement'}
                      {tier.level === 3 && 'Elite membership with all features'}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {tier.price === 0 ? 'Free' : `$${tier.price}/yr`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}