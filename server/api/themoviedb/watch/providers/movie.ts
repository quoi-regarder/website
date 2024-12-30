import { useAxios } from '@vueuse/integrations/useAxios'
import axiosClient from '../../axiosClient'
import { formatLanguageToString } from '~/utils/formatLanguageToString'

export default defineEventHandler(async (event) => {
  const { language } = getQuery(event)

  const url = `/watch/providers/movie?language=${language}&watch_region=${formatLanguageToString(language)}`

  const res = await useAxios(
    url,
    {
      method: 'GET'
    },
    axiosClient
  )

  return res.data.value
})
