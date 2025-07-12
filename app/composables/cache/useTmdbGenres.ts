export const useTmdbGenres = (type: string | ComputedRef<string>) => {
  const { locale } = useI18n()
  const typeValue = computed(() => (typeof type === 'string' ? type : type.value))
  const key = computed(() => `tmdb-genres-${typeValue.value}-${locale.value}`)

  const { data: genres, refresh } = useAsyncData<Option[]>(
    key.value,
    async () => {
      const manager = new QueryParamsManager(`/api/themoviedb/genre/${typeValue.value}/list`)
      manager.add('language', locale.value)
      const data = await $fetch(manager.toString())

      return data.genres.map((genre: any) => ({
        id: genre.id,
        label: formatGenre(genre.name)
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
    genres,
    refresh
  }
}
