export const formatLocalDate = (date: string): string => {
  const { locale, t } = useI18n()
  if (!date) return t('common.dateNotSet')

  return new Date(date).toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
