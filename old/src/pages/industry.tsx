import { createStyles, makeStyles, Theme } from '@material-ui/core';
import BlueprintsTab from '../components/BlueprintsTab';
import BuildCalculatorTab from '../components/BuildCalculatorTab';
import PageWrapper from '../components/PageWrapper';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../components/TabPanel';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import useTabs from '../hooks/useTabs';
import withApollo from '../lib/withApollo';
import IndustryJobsTab from '../components/IndustryJobsTab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tabToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const Industry: React.FC = () => {
  const classes = useStyles();
  const { handleTabChange, currentTab, tabProps, tabPanelProps } = useTabs('industryTab');

  return (
    <PageWrapper label="Industry">
      <Toolbar className={classes.tabToolbar}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="industry tabs"
        >
          <Tab label="Blueprints" {...tabProps(0)} />
          <Tab label="Jobs" {...tabProps(1)} />
          <Tab label="Build Calculator" {...tabProps(2)} />
        </Tabs>
      </Toolbar>
      <TabPanel {...tabPanelProps(0)}>
        <BlueprintsTab />
      </TabPanel>
      <TabPanel {...tabPanelProps(1)}>
        <IndustryJobsTab />
      </TabPanel>
      <TabPanel {...tabPanelProps(2)}>
        <BuildCalculatorTab />
      </TabPanel>
    </PageWrapper>
  );
};

export default withApollo(Industry);
