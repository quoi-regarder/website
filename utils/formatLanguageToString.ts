export const formatLanguageToString = (language: string | undefined) => {
  switch (language) {
    case 'en-US':
      return 'US'
    case 'fr-FR':
      return 'FR'
    default:
      return 'US'
  }
}
