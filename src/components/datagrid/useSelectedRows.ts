import { useGridApiContext } from "@mui/x-data-grid/hooks/utils/useGridApiContext";
import { GridEventListener } from "@mui/x-data-grid/models/events/gridEventListener";
import { useEffect, useState } from "react";

export function useSelectedRows() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const apiRef = useGridApiContext();
  
  useEffect(() => {
    const handleRowClick: GridEventListener<'rowSelectionChange'> = () => {
      const rows = Array.from(apiRef.current?.getSelectedRows()?.values()) ?? []
      setSelectedRows(rows);
    };
    return apiRef.current.subscribeEvent('rowSelectionChange', handleRowClick);
  }, [apiRef]);
  
  return selectedRows;
}
