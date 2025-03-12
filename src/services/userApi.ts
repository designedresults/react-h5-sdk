import { createApi } from '@reduxjs/toolkit/query/react';
import { fnBaseQuery } from '.';
import { RootState } from '..';
import { MIService } from '../mi/MIService';
import { IUserOutputMedia, loadUserContext } from '../features/userContextSlice';

export const configureUserApi = (mi: MIService) => {
  const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fnBaseQuery,
    endpoints: builder => ({
      listCompanies: builder.query<any[], void>({
        queryFn: async (_, api) => {
          try {
            const userId = (api.getState() as RootState).userContext.userId;
            if (!userId) {
              throw new Error('User ID must be set to change defaults.');
            }

            const response = await mi.execute({
              program: 'MNS150MI',
              transaction: 'LstCmpDivi',
              record: {
                USID: userId,
              },
            });

            const companies = response.items
              ?.filter((item: any) => item.CONO > '001')
              .reduce((map: Map<string, any>, item: any) => {
                if (!map.has(item.CONO)) {
                  map.set(item.CONO, {
                    id: item.CONO,
                    label: `${item.CONO} - ${item.CONM}`,
                  });
                }
                return map;
              }, new Map<string, any>());

            return { data: Array.from(companies?.values() ?? []) };
          } catch (error) {
            return { error };
          }
        },
      }),
      listDivisionsByCompany: builder.query<any[], string | undefined | null>({
        queryFn: async (company, api) => {
          try {
            const userId = (api.getState() as RootState).userContext.userId;
            if (!userId) {
              throw new Error('User ID must be set to change defaults.');
            }
            if (!company) {
              return { data: [] };
            }

            const response = await mi.execute({
              program: 'MNS150MI',
              transaction: 'LstCmpDivi',
              record: {
                USID: userId,
              },
            });

            const divisions = response.items
              ?.filter((item: any) => item.CONO === company)
              .map(item => ({
                id: item.DIVI === "" ? 'BLANK' : item.DIVI,
                label: `${item.DIVI === "" ? 'BLANK' : item.DIVI} - ${item.TX40}`,
              }));
              api.dispatch(loadUserContext)
            return { data: divisions };
          } catch (error) {
            return { error };
          }
        },
      }),
      changeCompanyDivision: builder.mutation<void, { company: string; division: string }>({
        queryFn: async (args, api) => {
          try {
            const userId = (api.getState() as RootState).userContext.userId;
            if (!userId) {
              return {
                error: new Error('User ID must be set to change defaults.'),
              };
            }
            const toCompany = args.company;
            const toDivision = args.division === 'BLANK' ? undefined : args.division
            
            await mi.execute({
              program: 'MNS150MI',
              transaction: 'ChgDefaultValue',
              record: {
                USID: userId,
                CONO: toCompany,
                DIVI: toDivision,
              },
            });
            mi.updateMIUserContext(args.company, toDivision ?? '')
            
            api.dispatch(loadUserContext())
            return { data: undefined };
          } catch (error) {
            return { error };
          }
        },
      }),
      listFacilities: builder.query<any[], void>({
        queryFn: async () => {
          try {
            const resp = await mi.execute({
              program: 'CRS008MI',
              transaction: 'ListFacility',
              outputFields: ['FACI', 'FACN'],
            });
            const facilities = resp?.items?.map(item => ({
              id: item.FACI,
              label: `${item.FACI} - ${item.FACN}`,
            }));
            return { data: facilities };
          } catch (error) {
            return { error };
          }
        },
      }),
      listWarehouseByFacility: builder.query<any[], string | undefined>({
        queryFn: async facility => {
          try {
            if (!facility) {
              return { data: undefined };
            }
            const resp = await mi.execute({
              program: 'MMS005MI',
              transaction: 'LstWarehouses',
              outputFields: ['WHLO', 'WHNM', 'FACI'],
            });
            const warehouses = resp?.items
              ?.filter(item => item.FACI === facility)
              .map(item => ({
                id: item.WHLO,
                label: `${item.WHLO} - ${item.WHNM}`,
              }));
            return { data: warehouses };
          } catch (error) {
            return { error };
          }
        },
      }),
      changeFacilityWarehouse: builder.mutation<void, { facility: string; warehouse: string }>({
        queryFn: async (args, api) => {
          try {
            const { userId, company } = (api.getState() as RootState).userContext;
            if (!userId) {
              throw new Error('User ID must be set to change defaults.');
            }
            if (!company) {
              throw new Error('Default company must be set to change defaults.');
            }
            await mi.execute({
              program: 'MNS150MI',
              transaction: 'ChgDefaultValue',
              record: {
                USID: userId,
                CONO: company,
                FACI: args.facility,
                WHLO: args.warehouse,
              },
            });
            api.dispatch(loadUserContext())
            return { data: undefined };
          } catch (error) {
            return { error };
          }
        },
      }),
      listPrinters: builder.query<any[], void>({
        queryFn: async () => {
          try {
            const resp = await mi.execute({
              program: 'CRS290MI',
              transaction: 'LstPrinters',
              outputFields: ['DEV', 'TX40', 'FACI'],
            });
            const printers = resp?.items?.map(item => ({
              id: item.DEV,
              label: `${item.DEV} - ${item.TX40}`,
            }));
            return { data: printers };
          } catch (error) {
            return { error };
          }
        },
      }),
      changePrinter: builder.mutation<void, { printer: IUserOutputMedia | undefined | null }>({
        queryFn: async (data, api) => {
          try {
            const { userId, company, printer } = (api.getState() as RootState).userContext;
            if (!userId) {
              throw new Error('User ID must be set to change printer.');
            }
            if (!company) {
              throw new Error('Default company must be set to change printer.');
            }
            if (!data?.printer) {
              throw new Error('Device must be set to change printer.');
            }
            await mi.execute({
              program: 'MNS204MI',
              transaction: 'UpdPrtMedia',
              record: {
                USID: userId,
                DIVI: printer?.division,
                PRTF: printer?.printerFile,
                DEV1: data?.printer,
                SEQN: printer?.sequence,
              },
            });
            api.dispatch(loadUserContext());
            return { data: undefined };
          } catch (error) {
            return { error };
          }
        },
      }),
    }),
  });

  return userApi;
};
