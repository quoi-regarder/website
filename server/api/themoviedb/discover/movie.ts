import axiosClient from '~/server/api/themoviedb/axiosClient'
import { useAxios } from '@vueuse/integrations/useAxios'

export default defineEventHandler(async (event) => {
  const url = '/discover/movie'

  const res = await useAxios(
    url,
    {
      method: 'GET'
    },
    axiosClient
  )

  return res.data.value
})
