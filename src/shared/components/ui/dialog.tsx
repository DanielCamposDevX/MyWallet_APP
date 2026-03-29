import type { ReactNode } from 'react'
import styled from 'styled-components'

type DialogProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function Dialog({ open, title, children, onClose }: DialogProps) {
  if (!open) return null

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </Content>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
`

const Content = styled.div`
  background: #fff;
  width: min(480px, 92vw);
  border-radius: 8px;
  padding: 20px;
`
