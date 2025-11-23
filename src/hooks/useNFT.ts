'use client'

import { useCallback, useState } from 'react'
import { nftAPI } from '@/lib/api'

export const useNFT = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listNFTs = useCallback(
    async (filters?: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.listNFTs(filters)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to list NFTs'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createNFT = useCallback(
    async (data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.createNFT(data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'NFT creation failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getNFT = useCallback(
    async (nftId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.getNFT(nftId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch NFT'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateNFT = useCallback(
    async (nftId: string, data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.updateNFT(nftId, data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to update NFT'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteNFT = useCallback(
    async (nftId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.deleteNFT(nftId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to delete NFT'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const purchaseNFT = useCallback(
    async (nftId: string, buyerId: string, transactionHash?: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.purchaseNFT(nftId, buyerId, transactionHash)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Purchase failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getNFTSalesHistory = useCallback(
    async (nftId: string, filters?: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await nftAPI.getNFTSalesHistory(nftId, filters)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch sales history'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    loading,
    error,
    listNFTs,
    createNFT,
    getNFT,
    updateNFT,
    deleteNFT,
    purchaseNFT,
    getNFTSalesHistory,
  }
}
