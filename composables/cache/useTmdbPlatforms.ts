export const useTmdbPlatforms = (type: string | ComputedRef<string>) => {
  const { locale } = useI18n()
  const typeValue = computed(() => (typeof type === 'string' ? type : type.value))
  const key = computed(() => `tmdb-platforms-${typeValue.value}-${locale.value}`)

  const { data: platforms, refresh } = useAsyncData<Option[]>(
    key.value,
    async () => {
      const manager = new QueryParamsManager(`/api/themoviedb/watch/providers/${typeValue.value}`)
      manager.add('language', locale.value)
      const data = await $fetch(manager.toString())

      return data.results.map((platform: any) => ({
        id: platform.provider_id,
        label: platform.provider_name,
        avatar: {
          src: getImageUrl(platform.logo_path, 'original'),
          alt: platform.provider_name
        }
      }))
    },
    {
      watch: [locale, typeValue],
      default: () => []
    }
  )

  watch(typeValue, () => {
    refresh()
  })

  return {
    platforms,
    refresh
  }
}
