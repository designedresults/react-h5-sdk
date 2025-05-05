import { useGridApiContext, GridApiPro, GridEventListener, gridRowSelectionIdsSelector } from '@mui/x-data-grid-pro';

import { useEffect, useState } from 'react';

export function useSelectedRows(apiRef?: React.RefObject<GridApiPro>) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  apiRef = apiRef ?? useGridApiContext();

  useEffect(() => {
    const handleRowClick: GridEventListener<'rowSelectionChange'> = () => {
      const rows = Array.from(gridRowSelectionIdsSelector(apiRef)?.values()) ?? [];
      setSelectedRows(rows);
    };
    return apiRef.current.subscribeEvent('rowSelectionChange', handleRowClick);
  }, [apiRef]);

  return selectedRows;
}
