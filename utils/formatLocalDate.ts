import type { CalendarDate } from '@internationalized/date'

export const formatLocalDate = (date: string | CalendarDate): string => {
  const { locale, t } = useI18n()
  if (!date) return t('common.dateNotSet')

  return new Date(date.toString()).toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
