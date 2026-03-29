import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  function updateQueryParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)

    if (!value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }

    setSearchParams(next)
  }

  return { query, searchParams, updateQueryParam }
}
