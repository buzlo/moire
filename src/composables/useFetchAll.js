export async function useFetchAll(urls, propertyToGet = null) {
  return await Promise.all(
    urls.map((url) => fetch(url).then(response => response.json()))
  ).then((parsedResponses) =>
    propertyToGet ? parsedResponses.map((parsedResponse) => parsedResponse[propertyToGet]) : parsedResponses
  )
}
