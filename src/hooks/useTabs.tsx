import { usePersistentState } from './usePersistentState';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const useTabs = (key: string) => {
  const router = useRouter();
  const query = router.query;
  const [currentTab, setCurrentTab] = usePersistentState<number>(key, +query.tab || 0);

  useEffect(() => {
    router.push(`${router.pathname}?tab=${currentTab}`, `/industry?tab=${currentTab}`, { shallow: true });
  }, [currentTab]);

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
