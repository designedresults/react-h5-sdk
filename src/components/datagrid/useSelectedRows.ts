import { useGridApiContext } from "@mui/x-data-grid/hooks/utils/useGridApiContext";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { GridEventListener } from "@mui/x-data-grid/models/events/gridEventListener";
import { useEffect, useState } from "react";

export function useSelectedRows(apiRef?: React.RefObject<GridApiCommunity>) {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  apiRef = apiRef ?? useGridApiContext();
  
  useEffect(() => {
    const handleRowClick: GridEventListener<'rowSelectionChange'> = () => {
      const rows = Array.from(apiRef.current?.getSelectedRows()?.values()) ?? []
      setSelectedRows(rows);
    };
    return apiRef.current.subscribeEvent('rowSelectionChange', handleRowClick);
  }, [apiRef]);
  
  return selectedRows;
}


