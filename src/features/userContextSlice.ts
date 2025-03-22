import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { M3API } from '@designedresults/m3api-h5-sdk';
import { getUserContext } from '../services/user';

 export interface IUserContextState extends IUserDefaults {
  userId: string | null;
  userName: string | null;
  principleUser: string | null;
  environment: string | null;
  tenantId: string | null;
  printer?: IUserOutputMedia | null;
  roles: string[] | null;
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
  company: string | null;
  companyName?: string | null;
  division: string | null;
  divisionName?: string | null;
  facility: string | null;
  facilityName?: string | null;
  warehouse: string | null;
  warehouseName?: string | null;
}

export const initialState: IUserContextState = {
  userId: null,
  userName: null,
  principleUser: null,
  environment: null,
  tenantId: null,
  company: null,
  division: null,
  facility: null,
  warehouse: null,
  printer: null,
  roles: null
};


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
      state.principleUser = action.payload.principleUser;
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
      state.roles= action.payload.roles;
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
    },
    setPrinter: (
      state: IUserContextState,
      action: PayloadAction<IUserOutputMedia | null>
    ) => {
      state.printer = action.payload;
    },
  },
});

export const userContextReducer = userContextSlice.reducer


export const loadUserContext = (m3api: M3API): AppThunk => {
  return async (dispatch)=>  {
    const userContext = await getUserContext(m3api);
    dispatch({ type: 'userContext/setUserContext', payload: userContext });
  }
}
