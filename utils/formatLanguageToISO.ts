export const formatLanguageToISO = (language: string | undefined) => {
  switch (language) {
    case 'us':
      return 'en-US'
    case 'fr':
      return 'fr-FR'
    default:
      return 'en-US'
  }
}
