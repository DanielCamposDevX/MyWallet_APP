import type { ReactNode } from 'react'
import styled from 'styled-components'

type TableProps = {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return <StyledTable>{children}</StyledTable>
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`
