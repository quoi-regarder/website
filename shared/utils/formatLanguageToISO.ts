export const formatLanguageToISO = (language: string | undefined) => {
  switch (language) {
    case 'en':
      return languageIsoType['en-US']
    case 'fr':
      return languageIsoType['fr-FR']
    default:
      return languageIsoType['en-US']
  }
}
