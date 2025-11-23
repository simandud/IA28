import Link from 'next/link'
import { Button } from '@/components/Button'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-garamond font-bold text-vault-900 leading-tight">
              Your Legacy
              <br />
              <span className="gradient-text">Never Expires</span>
            </h1>

            <p className="text-xl text-vault-600 max-w-lg">
              Record your wisdom. Create an AI avatar that your family can talk to forever.
              Monetize your insights. Build generational wealth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" fullWidth>
                  🚀 Start Your Legacy
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" size="lg" fullWidth>
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-vault-700">
                  <strong>50,000+</strong> people creating immortal legacies
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <p className="text-vault-700">
                  <strong>$15M+</strong> earned by families from wisdom NFTs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <p className="text-vault-700">
                  Available in <strong>50+ countries</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="bg-gradient-to-br from-gold-200 via-legacy-200 to-vault-200 rounded-2xl h-96 lg:h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-pulse">🏛️</div>
              <p className="text-2xl font-garamond text-vault-700">CHRONOVAULT</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-vault-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-garamond font-bold text-center text-vault-900 mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-vault-200">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-3">
                Record Your Legacy
              </h3>
              <p className="text-vault-600">
                Share your wisdom, stories, and life lessons through video. Tell the world who you
                really are.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-vault-200">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-3">
                Create Your Avatar
              </h3>
              <p className="text-vault-600">
                AI learns from your videos and becomes a conversational avatar. Your family can
                talk to you forever.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-vault-200">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-3">
                Monetize & Give
              </h3>
              <p className="text-vault-600">
                Your wisdom becomes NFTs. Generate perpetual royalties. Create generational wealth
                for your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-garamond font-bold text-center text-vault-900 mb-16">
          Simple, Transparent Pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="border border-vault-200 rounded-lg p-8">
            <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-2">Free</h3>
            <p className="text-vault-600 mb-6">Perfect for getting started</p>
            <p className="text-4xl font-bold text-vault-900 mb-6">
              $0<span className="text-lg">/month</span>
            </p>
            <Button variant="ghost" fullWidth className="mb-6">
              Get Started
            </Button>
            <ul className="space-y-3 text-sm text-vault-600">
              <li>✓ 3 videos recorded</li>
              <li>✓ Basic avatar</li>
              <li>✓ 10 avatar conversations/month</li>
              <li>✓ Private family access</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-gold-500 rounded-lg p-8 bg-gold-50 relative">
            <span className="absolute -top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
            <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-2">Pro</h3>
            <p className="text-vault-600 mb-6">For serious legacy creators</p>
            <p className="text-4xl font-bold text-gold-600 mb-6">
              $9.99<span className="text-lg">/month</span>
            </p>
            <Link href="/auth/signup">
              <Button variant="primary" fullWidth className="mb-6">
                Start Free Trial
              </Button>
            </Link>
            <ul className="space-y-3 text-sm text-vault-600">
              <li>✓ Unlimited videos</li>
              <li>✓ Advanced avatar</li>
              <li>✓ Unlimited conversations</li>
              <li>✓ Create wisdom NFTs</li>
              <li>✓ Earn royalties</li>
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="border border-vault-200 rounded-lg p-8">
            <h3 className="text-2xl font-garamond font-bold text-vault-900 mb-2">Premium</h3>
            <p className="text-vault-600 mb-6">Full immortality experience</p>
            <p className="text-4xl font-bold text-vault-900 mb-6">
              $99<span className="text-lg">/year</span>
            </p>
            <Button variant="secondary" fullWidth className="mb-6">
              Go Premium
            </Button>
            <ul className="space-y-3 text-sm text-vault-600">
              <li>✓ Everything in Pro</li>
              <li>✓ Professional avatar</li>
              <li>✓ Educational licensing</li>
              <li>✓ Ancestor Fund setup</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-vault-500 to-legacy-500 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-garamond font-bold text-white mb-6">
            Your Legacy Awaits
          </h2>
          <p className="text-xl text-white/90 mb-8">
            50,000+ people are already creating immortal legacies. Join them today.
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg">
              Get Started Free →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
