import { useRouter } from 'next/router';
import React from 'react';

const useTabs = (initialTab: number) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = React.useState(initialTab);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getTabClickHandler = (section: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`${router.pathname}?section=${section}`, `/industry?section=${section}`, { shallow: true });
  };

  const tabProps = (index: number, section: string) => {
    return {
      component: 'a',
      href: `${router.pathname}?section=${section}`,
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
      onClick: getTabClickHandler(section),
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
