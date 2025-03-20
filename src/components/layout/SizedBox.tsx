import Box from "@mui/material/Box";
import { useWindowSize } from "@uidotdev/usehooks";
import * as React from "react";

interface SizedBoxProps extends React.PropsWithChildren {
  minHeight?: number;
  margin?: number;
  padding?: number;
}

export const SizedBox: React.FC<SizedBoxProps> = ({ minHeight = 300, margin = 20, padding, children }) => {
  const ref = React.createRef<HTMLElement>();
  const [height, setHeight] = React.useState(minHeight);
  const size = useWindowSize();

  React.useLayoutEffect(() => {
    if (ref.current && size.height) {
      const boxPosY = ref.current.getBoundingClientRect().top;
      const availableHeight = size.height - boxPosY - margin;
      const boxHeight = Math.max(availableHeight, minHeight);
      setHeight(boxHeight);
    }
  }, [ref, size.height, margin, minHeight]);

  return (
    <Box sx={{ height }} ref={ref} padding={padding}>
      {children}
    </Box>
  );
};
