'use client'

import { useState } from 'react'
import { nftAPI } from '@/lib/api'

export const useNFT = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createNFT = async (data: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await nftAPI.createNFT(data)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'NFT creation failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const purchaseNFT = async (nftId: string, amount: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await nftAPI.purchaseNFT(nftId, amount)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Purchase failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return { createNFT, purchaseNFT, loading, error }
}
