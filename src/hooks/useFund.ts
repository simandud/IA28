'use client'

import { useCallback, useState } from 'react'
import { fundAPI } from '@/lib/api'

export const useFund = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listFunds = useCallback(
    async (filters?: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.listFunds(filters)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to list funds'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createFund = useCallback(
    async (data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.createFund(data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to create fund'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getFund = useCallback(
    async (fundId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.getFund(fundId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch fund'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateFund = useCallback(
    async (fundId: string, data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.updateFund(fundId, data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to update fund'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteFund = useCallback(
    async (fundId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.deleteFund(fundId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to delete fund'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const listBeneficiaries = useCallback(
    async (fundId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.listBeneficiaries(fundId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to list beneficiaries'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const addBeneficiary = useCallback(
    async (fundId: string, data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.addBeneficiary(fundId, data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to add beneficiary'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateBeneficiary = useCallback(
    async (fundId: string, beneficiaryId: string, data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.updateBeneficiary(fundId, beneficiaryId, data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to update beneficiary'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteBeneficiary = useCallback(
    async (fundId: string, beneficiaryId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.deleteBeneficiary(fundId, beneficiaryId)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to delete beneficiary'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getFundEarnings = useCallback(
    async (fundId: string, filters?: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.getFundEarnings(fundId, filters)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch earnings'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const recordEarnings = useCallback(
    async (fundId: string, data: Record<string, any>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fundAPI.recordEarnings(fundId, data)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Failed to record earnings'
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
    listFunds,
    createFund,
    getFund,
    updateFund,
    deleteFund,
    listBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getFundEarnings,
    recordEarnings,
  }
}
