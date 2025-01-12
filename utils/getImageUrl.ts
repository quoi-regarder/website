export default (url: string, size: string) => {
  return `https://image.tmdb.org/t/p/${size}${url}`
}
