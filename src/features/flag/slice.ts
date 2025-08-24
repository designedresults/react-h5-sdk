import { useAppSelector } from '../../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setUserContextEndpoint } from '../user/api/getUserContext';

export type FlagContextState = {
  flags: {
    [key: string]: boolean
  },
  roles: string[],
  config: { [key: string]: string[] }
}

const initialState: FlagContextState = {
  flags: {},
  roles: [],
  config: {}
};

const flagContextSlice = createSlice({
  name: 'flagContext',
  initialState,
  reducers: {
    setFlagConfig: (
      state: FlagContextState,
      action: PayloadAction<any>
    ) => {
      state.config = action.payload
      if (state.roles.length) {
        state.flags = loadFlags(action.payload, state.roles)
      }
    },
    setFlagRoles: (
      state: FlagContextState,
      action: PayloadAction<string[]>
    ) => {
      state.roles = action.payload
      if (Object.keys(state.config).length) {
        state.flags = loadFlags(state.config, action.payload)
      }
    },

  },
  extraReducers: (builder) => {
    builder.addMatcher(setUserContextEndpoint.matchFulfilled, (state, action) => {
      // when a new user context is set, update the roles and features
      state.roles = action.payload.roles
      if (Object.keys(state.config).length) {
        state.flags = loadFlags(state.config, action.payload.roles)
      }
    })
  }
});

const loadFlags = (config: FlagContextState['config'], roles: FlagContextState['roles']) => {
  const flags: FlagContextState['flags'] = {}
  Object.entries(config).forEach(([flag, allowedRoles]) => {
    flags[flag] = allowedRoles.some(r => roles.includes(r))
  })
  return flags
}

export const flagContextReducer = flagContextSlice.reducer
export const { setFlagConfig } = flagContextSlice.actions


export const useFlag = (flag: string) => {
  const flags = useAppSelector(state => state.flagContext.flags)
  return flags[flag] === true
}

export const useFlags = (flag: string[]) => {
  const flags = useAppSelector(state => state.flagContext.flags)
  return flag.map(flag => flags[flag])
}

export const usePreviewFlags = (roles?: string[]) => {
  const config = useAppSelector(state => state.flagContext.config)
  if (!roles || !config) {
    return undefined
  }
  return loadFlags(config, roles)
}
