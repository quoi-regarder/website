export const formatLanguageToISO = (language: string | undefined) => {
  switch (language) {
    case 'en':
      return 'en-US'
    case 'fr':
      return 'fr-FR'
    default:
      return 'en-US'
  }
}
