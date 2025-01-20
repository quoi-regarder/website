export const useMovie = () => {
  const { getMovieByTmdbId } = useMovieListStore()
  const user = useSupabaseUser()
  let manager: QueryParamsManager

  const getByTmdbId = async (tmdbId: number) => {
    manager = new QueryParamsManager(`/api/movies/${tmdbId}`)
    const response: Tables<'movies'> | undefined = await $fetch(manager.toString())
    return response
  }

  const syncMovie = async (exisitingMovie: Tables<'movies'> | undefined, tmdbId: number) => {
    if (exisitingMovie === undefined) {
      manager = new QueryParamsManager(`/api/themoviedb/movie/${tmdbId}`)
      const response: Tables<'movies'> = await $fetch(manager.toString())

      manager = new QueryParamsManager('/api/movies')

      await $fetch(manager.toString(), {
        method: 'POST',
        body: {
          tmdb_id: tmdbId,
          release_date: response.release_date,
          poster_path: response.poster_path,
          runtime: response.runtime
        }
      })
    }
  }

  const syncTranslation = async (exisitingMovie: Tables<'movies'> | undefined, tmdbId: number) => {
    Object.keys(languageIsoTypes).forEach(async (language: Enums<'language_iso_types'>) => {
      if (
        exisitingMovie?.movie_translations?.find(
          (translation: Tables<'movie_translations'>) => translation.language === language
        )
      ) {
        return null
      }

      manager = new QueryParamsManager(`/api/themoviedb/movie/${tmdbId}`)
      manager.add('language', language)

      const response = await $fetch(manager.toString())

      if (response === undefined) {
        return null
      }

      manager = new QueryParamsManager('/api/movie-translations')

      await $fetch(manager.toString(), {
        method: 'POST',
        body: {
          tmdb_id: tmdbId,
          language,
          title: response?.title,
          overview: response?.overview
        }
      })
    })
  }

  const postUserMovieList = async (tmdbId: number, status: Enums<'movie_list_status'>) => {
    manager = new QueryParamsManager('/api/user-movie-list')

    await $fetch(manager.toString(), {
      method: 'POST',
      body: {
        tmdb_id: tmdbId,
        user_id: user.value?.id,
        status: status
      }
    })
  }

  const deleteMovieFromList = async (tmdbId: number) => {
    manager = new QueryParamsManager(`/api/user-movie-list/${user.value?.id}/movie/${tmdbId}`)

    await $fetch(manager.toString(), {
      method: 'DELETE'
    })
  }

  const addMovieToList = async (tmdbId: number, status: Enums<'movie_list_status'>) => {
    const exisitingMovie: Tables<'movies'> | undefined = await getByTmdbId(tmdbId)

    await syncMovie(exisitingMovie, tmdbId)
    await syncTranslation(exisitingMovie, tmdbId)

    const movie = getMovieByTmdbId(tmdbId)

    if (movie && movie.status === status) {
      await deleteMovieFromList(tmdbId)
      return
    } else {
      await postUserMovieList(tmdbId, status)
    }
  }

  return {
    addMovieToList
  }
}
