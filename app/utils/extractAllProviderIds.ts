export default (providers: any) => {
  // Create a Map to store unique providers using provider_id as key
  const uniqueProvidersIds = new Set<number>([-1, 0])

  // Check if providers is an object and has keys
  if (!providers) {
    return Array.from(uniqueProvidersIds)
  }

  // Iterate through all provider types (buy, rent, flatrate, etc.)
  Object.values(providers).forEach((providerList) => {
    if (Array.isArray(providerList)) {
      providerList.forEach((provider) => {
        if (!uniqueProvidersIds.has(provider.provider_id)) {
          uniqueProvidersIds.add(provider.provider_id)
        }
      })
    }
  })

  // Convert Map values to array and sort by display_priority
  return Array.from(uniqueProvidersIds)
}
