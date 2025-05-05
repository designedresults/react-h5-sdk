import { useGridApiContext, GridApiPro, GridEventListener, gridRowSelectionIdsSelector } from '@mui/x-data-grid-pro';

import { useEffect, useState } from 'react';

export function useSelectedRowsPro(apiRef?: React.RefObject<GridApiPro | null>) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  if (!apiRef) {
    apiRef = useGridApiContext() as React.RefObject<GridApiPro | null>;
  }

  useEffect(() => {
    const handleRowClick: GridEventListener<'rowSelectionChange'> = () => {
      if (apiRef) {
        const rows = Array.from(gridRowSelectionIdsSelector(apiRef)?.values()) ?? [];
        setSelectedRows(rows);
      }
    };
    return apiRef?.current?.subscribeEvent('rowSelectionChange', handleRowClick);
  }, [apiRef]);

  return selectedRows;
}
