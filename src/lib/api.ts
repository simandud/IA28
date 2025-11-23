import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Avatar & Conversation API
export const avatarAPI = {
  createAvatar: (data: Record<string, any>) => api.post('/api/avatar', data),
  getAvatar: (avatarId: string) => api.get(`/api/avatar/${avatarId}`),
  updateAvatar: (avatarId: string, data: Record<string, any>) =>
    api.patch(`/api/avatar/${avatarId}`, data),
  sendMessage: (avatarId: string, message: string) =>
    api.post(`/api/avatar/${avatarId}/chat`, { message }),
  getConversations: (avatarId: string) =>
    api.get(`/api/avatar/${avatarId}/conversations`),
}

// Video API
export const videoAPI = {
  uploadVideo: (file: File, metadata: Record<string, any>) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    return api.post('/api/video/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getVideos: (userId: string) => api.get(`/api/user/${userId}/videos`),
  deleteVideo: (videoId: string) => api.delete(`/api/video/${videoId}`),
}

// NFT API
export const nftAPI = {
  listNFTs: (filters?: Record<string, any>) =>
    api.get('/api/nft', { params: filters }),
  createNFT: (data: Record<string, any>) => api.post('/api/nft', data),
  getNFT: (nftId: string) => api.get(`/api/nft/${nftId}`),
  updateNFT: (nftId: string, data: Record<string, any>) =>
    api.patch(`/api/nft/${nftId}`, data),
  deleteNFT: (nftId: string) => api.delete(`/api/nft/${nftId}`),
  purchaseNFT: (nftId: string, buyerId: string, transactionHash?: string) =>
    api.post(`/api/nft/${nftId}/purchase`, { buyerId, transactionHash }),
  getNFTSalesHistory: (nftId: string, filters?: Record<string, any>) =>
    api.get(`/api/nft/${nftId}/purchase`, { params: filters }),
}

// Fund API
export const fundAPI = {
  listFunds: (filters?: Record<string, any>) =>
    api.get('/api/fund', { params: filters }),
  createFund: (data: Record<string, any>) => api.post('/api/fund', data),
  getFund: (fundId: string) => api.get(`/api/fund/${fundId}`),
  updateFund: (fundId: string, data: Record<string, any>) =>
    api.patch(`/api/fund/${fundId}`, data),
  deleteFund: (fundId: string) => api.delete(`/api/fund/${fundId}`),
  listBeneficiaries: (fundId: string) =>
    api.get(`/api/fund/${fundId}/beneficiaries`),
  addBeneficiary: (fundId: string, data: Record<string, any>) =>
    api.post(`/api/fund/${fundId}/beneficiaries`, data),
  updateBeneficiary: (fundId: string, beneficiaryId: string, data: Record<string, any>) =>
    api.patch(`/api/fund/${fundId}/beneficiaries/${beneficiaryId}`, data),
  deleteBeneficiary: (fundId: string, beneficiaryId: string) =>
    api.delete(`/api/fund/${fundId}/beneficiaries/${beneficiaryId}`),
  getFundEarnings: (fundId: string, filters?: Record<string, any>) =>
    api.get(`/api/fund/${fundId}/earnings`, { params: filters }),
  recordEarnings: (fundId: string, data: Record<string, any>) =>
    api.post(`/api/fund/${fundId}/earnings`, data),
}

// User API
export const userAPI = {
  getProfile: (userId: string) => api.get(`/api/user/${userId}`),
  updateProfile: (userId: string, data: Record<string, any>) =>
    api.patch(`/api/user/${userId}`, data),
  getMetrics: (userId: string) => api.get(`/api/user/${userId}/metrics`),
}

export default api
