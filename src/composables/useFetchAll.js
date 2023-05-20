export async function useFetchAll({
  urls,
  method = 'GET',
  body = null,
  propertyToGet = '',
}) {
  return await Promise.all(
    urls.map((url) =>
      fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': method !== 'GET' ? 'application/json' : null
        }
      }).then(async (response) => {
        const parsedRes = await response.json()
        if (parsedRes.error) throw new Error(JSON.stringify(parsedRes.error))
        return parsedRes
      })
    )
  ).then((parsedResponses) =>
    propertyToGet
      ? parsedResponses.map((parsedResponse) => parsedResponse[propertyToGet])
      : parsedResponses
  )
}
