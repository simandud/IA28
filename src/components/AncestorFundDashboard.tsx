'use client'

import React from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { formatCurrency } from '@/utils/helpers'

interface AncestorFundDashboardProps {
  fundId?: string
}

export const AncestorFundDashboard: React.FC<AncestorFundDashboardProps> = ({
  fundId = 'demo',
}) => {
  // Mock data
  const fund = {
    id: fundId,
    name: 'My Life Legacy',
    totalValue: 24350,
    monthlyEarnings: 892.5,
    status: 'active' as const,
  }

  const beneficiaries = [
    { id: '1', name: 'Sarah (Daughter)', relationship: 'Child', allocation: 40, monthlyPayout: 357 },
    { id: '2', name: 'Tom (Son)', relationship: 'Child', allocation: 40, monthlyPayout: 357 },
    { id: '3', name: 'Jake (Grandson)', relationship: 'Grandchild', allocation: 20, monthlyPayout: 178 },
  ]

  const earnings = [
    { source: 'NFT Royalties', amount: 450, percentage: 40 },
    { source: 'Subscriptions', amount: 312, percentage: 35 },
    { source: 'Licensing', amount: 222, percentage: 25 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-garamond font-bold text-vault-900 mb-2">
          Ancestor Fund: {fund.name}
        </h2>
        <p className="text-vault-600">Your legacy working for your family</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="space-y-2">
            <p className="text-vault-600 text-sm font-medium">Fund Value</p>
            <p className="text-3xl font-bold text-gold-500">
              {formatCurrency(fund.totalValue)}
            </p>
            <p className="text-xs text-green-600 font-medium">✓ Active</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-vault-600 text-sm font-medium">This Month</p>
            <p className="text-3xl font-bold text-legacy-500">
              {formatCurrency(fund.monthlyEarnings)}
            </p>
            <p className="text-xs text-vault-500">Generated for your heirs</p>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <p className="text-vault-600 text-sm font-medium">Lifetime Total</p>
            <p className="text-3xl font-bold text-vault-700">
              {formatCurrency(15672)}
            </p>
            <p className="text-xs text-vault-500">Since fund creation</p>
          </div>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-vault-900 mb-4">Earnings Sources</h3>
        <div className="space-y-3">
          {earnings.map((earning, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-vault-700 font-medium">{earning.source}</span>
                <span className="text-gold-600 font-semibold">
                  {formatCurrency(earning.amount)}
                </span>
              </div>
              <div className="w-full bg-vault-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gold-500 to-legacy-500 h-2 rounded-full"
                  style={{ width: `${earning.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Beneficiaries */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-vault-900">Your Heirs</h3>
          <Button variant="secondary" size="sm">
            + Add Heir
          </Button>
        </div>

        <div className="space-y-3">
          {beneficiaries.map((heir) => (
            <div
              key={heir.id}
              className="p-4 bg-vault-50 rounded-lg border border-vault-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-vault-900">{heir.name}</p>
                  <p className="text-sm text-vault-600">{heir.relationship}</p>
                </div>
                <p className="text-lg font-bold text-gold-500">
                  {formatCurrency(heir.monthlyPayout)}/mo
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-block px-2 py-1 bg-gold-100 text-gold-700 rounded">
                  {heir.allocation}% allocation
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Distribution Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-vault-900 mb-4">Distribution Settings</h3>

        <div className="space-y-3">
          <div className="p-4 bg-legacy-50 rounded-lg border border-legacy-200">
            <p className="text-sm text-legacy-700 mb-2">
              ⏰ <strong>Distribution Schedule</strong>
            </p>
            <p className="text-sm text-legacy-600">Monthly to all beneficiaries</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">
              🔒 <strong>Fund Control</strong>
            </p>
            <p className="text-sm text-blue-600">
              You control fund settings while living. After death, heirs vote on management.
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="secondary">Edit Settings</Button>
          <Button variant="ghost">View Legal Docs</Button>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-gold-100 to-legacy-100 border-gold-300">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-vault-900 mb-2">
            Grow Your Legacy Fund
          </h3>
          <p className="text-vault-700 mb-4">
            Create more wisdom NFTs to increase your fund earnings
          </p>
          <Button variant="primary">Create Wisdom NFT</Button>
        </div>
      </Card>
    </div>
  )
}
