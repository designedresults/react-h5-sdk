import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { load, type SecurityConfig } from './securityConfig';
import { type AppThunk } from './store';
import { getUserContext } from './user/api/getUserContext';

export interface IUserContextState extends IUserDefaults {
  userId: string;
  userName: string;
  environment: string;
  tenantId: string;
  printer?: IUserOutputMedia;
  roles: string[];
  impersonator: string | null;
  security?: IAppSecurity | null;
}

export interface IUserOutputMedia {
  division?: string;
  printerFile?: string;
  media?: '*PRT' | '*MAIL' | '*FILE' | '*FAX' | '*ARCHIVE';
  location?: string;
  sequence?: string;
  device?: string;
}

export interface IUserDefaults {
  company: string
  companyName?: string
  division: string
  divisionName?: string
  facility: string
  facilityName?: string
  warehouse: string
  warehouseName?: string
}

export interface IAppSecurity {
  defaultPath: string,
  allowedPaths: string[],
  features: string[]
}

export const initialState: IUserContextState = {
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

let securityConfig: SecurityConfig | null = null;


const userContextSlice = createSlice({
  name: 'userContext',
  initialState,
  reducers: {
    setUserContext: (
      state: IUserContextState,
      action: PayloadAction<IUserContextState>
    ) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.environment = action.payload.environment;
      state.tenantId = action.payload.tenantId;
      state.company = action.payload.company;
      state.companyName = action.payload.companyName;
      state.division = action.payload.division;
      state.divisionName = action.payload.divisionName;
      state.facility = action.payload.facility;
      state.facilityName = action.payload.facilityName;
      state.warehouse = action.payload.warehouse;
      state.warehouseName = action.payload.warehouseName;
      state.printer = action.payload.printer;
      state.roles = action.payload.roles;
      state.impersonator = action.payload.impersonator

      if (securityConfig && action.payload.roles?.length) {
        state.security = load(securityConfig, action.payload.roles)
      }

    },
    setDefaults: (
      state: IUserContextState,
      action: PayloadAction<IUserDefaults | null>
    ) => {
      if (action.payload?.company) {
        state.company = action.payload.company;
      }
      if (action.payload?.division) {
        state.division = action.payload.division;
      }
      if (action.payload?.facility) {
        state.facility = action.payload.facility;
      }
      if (action.payload?.warehouse) {
        state.warehouse = action.payload.warehouse;
      }
    }
  },
});

export const userContextReducer = userContextSlice.reducer

export const setSecurityConfig = (config: SecurityConfig) => {
  securityConfig = config
}

export const loadUserContext = (userId: string | null): AppThunk => {
  return async (dispatch) => {
    const userContext = await getUserContext({ userId });
    dispatch({ type: 'userContext/setUserContext', payload: userContext });
  }
}

