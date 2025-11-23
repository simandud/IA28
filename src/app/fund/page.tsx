'use client'

import React from 'react'
import { AncestorFundDashboard } from '@/components/AncestorFundDashboard'

export default function Fund() {
  return (
    <div className="min-h-screen bg-vault-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AncestorFundDashboard />
      </div>
    </div>
  )
}
