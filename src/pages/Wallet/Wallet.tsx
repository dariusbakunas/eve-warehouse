import { Route, useHistory, useLocation } from 'react-router';
import { Tab, Tabs } from 'carbon-components-react';
import React, { useCallback, useEffect, useMemo } from 'react';

enum WalletRoutes {
  TRANSACTIONS,
  ORDERS,
  JOURNAL,
}

export const Wallet: React.FC = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const handleTabChange = useCallback(
    (index: number) => {
      switch (index) {
        case WalletRoutes.TRANSACTIONS:
          history.push('/wallet/transactions');
          break;
        case WalletRoutes.ORDERS:
          history.push('/wallet/orders');
          break;
        case WalletRoutes.JOURNAL:
          history.push('/wallet/journal');
          break;
      }
    },
    [history]
  );

  const selectedIndex = useMemo(() => {
    switch (pathname) {
      case '/wallet/transactions':
        return WalletRoutes.TRANSACTIONS;
      case '/wallet/orders':
        return WalletRoutes.ORDERS;
      case '/wallet/journal':
        return WalletRoutes.JOURNAL;
      default:
        return WalletRoutes.TRANSACTIONS;
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/wallet') {
      history.push('/wallet/transactions');
    }
  }, [pathname]);

  return (
    <div className="page-container wallet">
      <Tabs onSelectionChange={handleTabChange} selected={selectedIndex}>
        <Tab href="/transactions" id="tab-1" label="Transactions">
          <Route path="/wallet/transactions">
            <div>transactions</div>
          </Route>
        </Tab>
        <Tab href="/orders" id="tab-2" label="Market Orders">
          <Route path="/wallet/orders">
            <div>orders</div>
          </Route>
        </Tab>
        <Tab href="/journal" id="tab-3" label="Journal">
          <Route path="/wallet/journal">
            <div>journal</div>
          </Route>
        </Tab>
      </Tabs>
    </div>
  );
};
