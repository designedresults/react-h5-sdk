import { useGridApiContext, GridApiPro, GridEventListener, gridRowSelectionIdsSelector } from '@mui/x-data-grid-pro';

import { useEffect, useState } from 'react';

export function useSelectedRowsPro<T>(apiRef?: React.RefObject<GridApiPro | null>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  
  if (!apiRef) {
    apiRef = useGridApiContext() as React.RefObject<GridApiPro | null>;
  }

  useEffect(() => {
    const handleRowClick: GridEventListener<'rowSelectionChange'> = () => {
      if (apiRef) {
        const rows = Array.from(gridRowSelectionIdsSelector(apiRef)?.values()) ?? [];
        setSelectedRows(rows as T[]);
      }
    };
    return apiRef?.current?.subscribeEvent('rowSelectionChange', handleRowClick);
  }, [apiRef]);

  return selectedRows;
}
