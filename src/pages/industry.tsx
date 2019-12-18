import { createStyles, makeStyles, Theme } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../components/TabPanel';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import useTabs from '../hooks/useTabs';
import withApollo from '../lib/withApollo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tabToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const Industry = () => {
  const classes = useStyles();
  const { currentTab, handleTabChange, tabProps, tabPanelProps } = useTabs();

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
      <TabPanel {...tabPanelProps(0)}>Blueprints</TabPanel>
      <TabPanel {...tabPanelProps(1)}>Jobs</TabPanel>
      <TabPanel {...tabPanelProps(2)}>Build Calculator</TabPanel>
    </PageWrapper>
  );
};

export default withApollo(Industry);
