export const formatLanguageToCountryCode = (language: string | undefined) => {
  switch (language) {
    case 'en':
      return 'US'
    case 'fr':
      return 'FR'
    default:
      return 'US'
  }
}
