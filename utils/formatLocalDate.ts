export const formatLocalDate = (date: string): string => {
  const { locale } = useI18n()
  return new Date(date).toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
