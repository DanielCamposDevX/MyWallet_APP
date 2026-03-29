import { createContext, useContext, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type RequestState = {
  token?: string
}

type RequestContextValue = {
  request: RequestState
  setRequest: Dispatch<SetStateAction<RequestState>>
}

const RequestContext = createContext<RequestContextValue | undefined>(undefined)

type RequestProviderProps = {
  children: ReactNode
}

export function RequestProvider({ children }: RequestProviderProps) {
  const [request, setRequest] = useState<RequestState>({})

  return (
    <RequestContext.Provider value={{ request, setRequest }}>
      {children}
    </RequestContext.Provider>
  )
}

export function useRequestContext() {
  const context = useContext(RequestContext)

  if (!context) {
    throw new Error('useRequestContext must be used inside RequestProvider')
  }

  return context
}
