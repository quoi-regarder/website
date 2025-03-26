export const translations: { [key: string]: string } = {
  'Action & Adventure': 'Action et Aventure',
  Animation: 'Animation',
  Comédie: 'Comédie',
  Crime: 'Crime',
  Documentaire: 'Documentaire',
  Western: 'Western',
  'War & Politics': 'Guerre et Politique',
  Talk: 'Talk-Show',
  Soap: 'Feuilleton',
  'Science-Fiction & Fantastique': 'Science-Fiction et Fantastique',
  Reality: 'Téléréalité',
  News: 'Actualités',
  Mystère: 'Mystère',
  Kids: 'Jeunesse',
  Familial: 'Familial',
  Drame: 'Drame'
}

export const formatGenre = (genre: string): string => {
  return translations[genre] || genre
}
