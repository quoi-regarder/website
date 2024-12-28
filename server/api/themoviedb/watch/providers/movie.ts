import { useAxios } from '@vueuse/integrations/useAxios'
import axiosClient from '../../axiosClient'
import { formatLanguageToISO } from '~/utils/formatLanguageToISO'

export default defineEventHandler(async (event) => {
  const { language } = getQuery(event)

  const url = `/watch/providers/movie?language=${formatLanguageToISO(language)}&watch_region=${language}`

  const res = await useAxios(
    url,
    {
      method: 'GET'
    },
    axiosClient
  )

  return res.data.value
})
