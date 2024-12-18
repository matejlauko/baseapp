import { useContext } from 'react'
import { TreeContext, type TreeContextType } from './context'

export const useTree = <T = { [key: string]: unknown }>(): TreeContextType<T> => {
  const context = useContext(TreeContext)

  if (!context) {
    throw new Error('useTree must be used within a TreeProvider')
  }

  return context as TreeContextType<T>
}
