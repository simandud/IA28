import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'CHRONOVAULT - Your Legacy Lives Forever',
  description:
    'Create an immortal digital legacy. Record videos, build an AI avatar, monetize your wisdom, and create generational wealth.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-vault-200 bg-vault-50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-garamond font-bold text-vault-900 mb-4">CHRONOVAULT</h3>
                <p className="text-vault-600 text-sm">Your legacy never dies</p>
              </div>
              <div>
                <h4 className="font-semibold text-vault-900 mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Roadmap
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-vault-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-vault-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-vault-600 hover:text-gold-500">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-vault-200 pt-8">
              <p className="text-center text-vault-600 text-sm">
                © 2024 CHRONOVAULT. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
