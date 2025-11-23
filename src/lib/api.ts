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
  createNFT: (data: Record<string, any>) => api.post('/api/nft/create', data),
  getNFT: (nftId: string) => api.get(`/api/nft/${nftId}`),
  listNFTs: (filters?: Record<string, any>) =>
    api.get('/api/nft/marketplace', { params: filters }),
  purchaseNFT: (nftId: string, amount: number) =>
    api.post(`/api/nft/${nftId}/purchase`, { amount }),
  getUserNFTs: (userId: string) => api.get(`/api/user/${userId}/nfts`),
}

// Fund API
export const fundAPI = {
  createFund: (data: Record<string, any>) => api.post('/api/fund/create', data),
  getFund: (fundId: string) => api.get(`/api/fund/${fundId}`),
  addBeneficiary: (fundId: string, data: Record<string, any>) =>
    api.post(`/api/fund/${fundId}/beneficiary`, data),
  getFundEarnings: (fundId: string) => api.get(`/api/fund/${fundId}/earnings`),
  updateBeneficiary: (fundId: string, beneficiaryId: string, data: Record<string, any>) =>
    api.patch(`/api/fund/${fundId}/beneficiary/${beneficiaryId}`, data),
}

// User API
export const userAPI = {
  getProfile: (userId: string) => api.get(`/api/user/${userId}`),
  updateProfile: (userId: string, data: Record<string, any>) =>
    api.patch(`/api/user/${userId}`, data),
  getMetrics: (userId: string) => api.get(`/api/user/${userId}/metrics`),
}

export default api
