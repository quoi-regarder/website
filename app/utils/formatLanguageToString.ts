export const formatLanguageToString = (language: string | undefined) => {
  switch (language) {
    case 'en-US':
      return 'en'
    case 'fr-FR':
      return 'fr'
    default:
      return 'en'
  }
}
