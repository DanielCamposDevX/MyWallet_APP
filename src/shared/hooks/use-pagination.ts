import { useMemo, useState } from 'react'

export function usePagination(totalItems: number, perPage = 10) {
  const [page, setPage] = useState(1)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / perPage)), [totalItems, perPage])

  function nextPage() {
    setPage((current) => Math.min(current + 1, totalPages))
  }

  function previousPage() {
    setPage((current) => Math.max(current - 1, 1))
  }

  return { page, setPage, totalPages, nextPage, previousPage }
}
