import React, { createContext, Dispatch, useReducer } from 'react'

import { State } from '../types/state'
import reducer, { ReducerAction } from './reducer'

interface StoreProviderProps {
  children: any
}

const initialState: State = {
  onboarding: {
    DidAgreeToTerms: false,
    DidCompleteTutorial: false,
    DidCreatePIN: false,
  },
  notifications: {
    ConnectionPending: false,
  },
  error: null,
}

export const Context = createContext<[State, Dispatch<ReducerAction>]>([
  initialState,
  () => {
    // eslint-disable-next-line no-useless-return
    return
  },
])

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  )
}

export default StoreProvider
