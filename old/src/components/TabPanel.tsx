import Box from '@material-ui/core/Box';
import React from 'react';
import Typography from '@material-ui/core/Typography';

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  tab: number;
}

const TabPanel: React.FC<ITabPanelProps> = props => {
  const { children, tab, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tab !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {tab === index && <Box p={2}>{children}</Box>}
    </Typography>
  );
};

export default TabPanel;
