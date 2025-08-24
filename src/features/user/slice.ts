import { useAppSelector } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setUserContextEndpoint } from './api/getUserContext';

export type UserContext = UserDefaults & {
  userId: string;
  userName: string;
  environment: string;
  tenantId: string;
  printer?: UserOutputMedia;
  roles: string[];
  impersonator: string | null;
}

export type UserOutputMedia = {
  division?: string;
  printerFile?: string;
  media?: '*PRT' | '*MAIL' | '*FILE' | '*FAX' | '*ARCHIVE';
  location?: string;
  sequence?: string;
  device?: string;
}

export type UserDefaults = {
  company: string
  companyName?: string
  division: string
  divisionName?: string
  facility: string
  facilityName?: string
  warehouse: string
  warehouseName?: string
}

export const initialState: UserContext = {
  userId: '',
  userName: '',
  environment: '',
  tenantId: '',
  company: '',
  division: '',
  facility: '',
  warehouse: '',
  printer: {},
  roles: [],
  impersonator: null
};


const userContextSlice = createSlice({
  name: 'userContext',
  initialState,
  reducers: {
    setUserContext: (
      state: UserContext,
      action: PayloadAction<UserContext>
    ) => {
      state.userId = action.payload.userId
      state.userName = action.payload.userName
      state.environment = action.payload.environment
      state.tenantId = action.payload.tenantId
      state.company = action.payload.company
      state.division = action.payload.division
      state.facility = action.payload.facility
      state.warehouse = action.payload.warehouse
      state.printer = action.payload.printer
      state.roles = action.payload.roles
      state.impersonator = action.payload.impersonator
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(setUserContextEndpoint.matchFulfilled, (state, action) => {
      state.userId = action.payload.userId
      state.userName = action.payload.userName
      state.environment = action.payload.environment
      state.tenantId = action.payload.tenantId
      state.company = action.payload.company
      state.companyName = action.payload.companyName
      state.division = action.payload.division
      state.divisionName = action.payload.divisionName
      state.facility = action.payload.facility
      state.facilityName = action.payload.facilityName
      state.warehouse = action.payload.warehouse
      state.warehouseName = action.payload.warehouseName
      state.printer = action.payload.printer
      state.roles = action.payload.roles
      state.impersonator = action.payload.impersonator
    })
  }
});

export const userContextReducer = userContextSlice.reducer

export const { setUserContext } = userContextSlice.actions


export const useFacility = () => {
  return useAppSelector(state => state.userContext.facility)
}
export const useWarehouse = () => {
  return useAppSelector(state => state.userContext.warehouse)
}