import axios from 'axios'

const { tmdbApiKey } = useRuntimeConfig()
const axiosClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3'
})

axiosClient.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    api_key: tmdbApiKey
  }

  return request
})

export default axiosClient
