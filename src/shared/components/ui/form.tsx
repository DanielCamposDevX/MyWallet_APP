import type { FormHTMLAttributes } from 'react'
import styled from 'styled-components'

export default function Form(props: FormHTMLAttributes<HTMLFormElement>) {
  return <StyledForm {...props} />
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
