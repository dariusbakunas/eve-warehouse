import { Box } from './Box';
import { ComponentProps } from 'react';

export const Layout = ({ children }: ComponentProps<any>) => (
  <Box
    css={{
      maxW: "100%"
    }}
  >
    {children}
  </Box>
);