import { usePersistentState } from './usePersistentState';
import React from 'react';

const useTabs = (key: string, defaultTab: number) => {
  const [currentTab, setCurrentTab] = usePersistentState<number>(key, defaultTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabProps = (index: number) => {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  };

  const tabPanelProps = (index: number) => {
    return {
      tab: currentTab,
      index,
    };
  };

  return {
    currentTab,
    handleTabChange,
    tabProps,
    tabPanelProps,
  };
};

export default useTabs;
