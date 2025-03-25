export const formatLanguageToISO = (language: string | undefined) => {
  switch (language) {
    case 'us':
      return languageIsoType['en-US']
    case 'fr':
      return languageIsoType['fr-FR']
    default:
      return languageIsoType['en-US']
  }
}
