export const formatLanguageToString = (language: string | undefined) => {
  switch (language) {
    case 'en-US':
      return 'us'
    case 'fr-FR':
      return 'fr'
    default:
      return 'en'
  }
}
