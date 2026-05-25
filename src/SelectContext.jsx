import { createContext, useContext } from 'react'

export const SelectContext = createContext(null)

export function useSelectContext() {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('Select subcomponents must be used within <Select />')
  }
  return ctx
}
