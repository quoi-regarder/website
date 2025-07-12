import type { CalendarDate } from '@internationalized/date'

export type Filter = {
  name: string
  value: string
}

export type FilterState = {
  selectedType: 'movie' | 'tv'
  selectedGenres: Option[]
  selectedPlatforms: Option[]
  selectedMark: number
  selectedFilterBy: Option
  selectedFilterByDirection: 'asc' | 'desc' | null
  selectedAges: Option[]
  selectedDuration: [number, number]
  selectedMonetization: Option[]
  selectedVotes: number
  selectedPersons: Option[]
  selectedCompanies: Option[]
  fromDate: CalendarDate | null
  toDate: CalendarDate | null
  airFromDate: CalendarDate | null
  airToDate: CalendarDate | null
}
