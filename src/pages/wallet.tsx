import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import withApollo from '../lib/withApollo';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import WalletTransactionsTab from '../components/WalletTransactionsTab';
import Maybe from 'graphql/tsutils/Maybe';
import { Order, OrderType, WalletJournalOrderBy, WalletTransactionOrderBy } from '../__generated__/globalTypes';
import WalletJournalTab from '../components/WalletJournalTab';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    paper: {
      width: 'calc(100vw - 120px)',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    title: {
      marginRight: '20px',
    },
    labelToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const Wallet = () => {
  const classes = useStyles();
  const [characterId, setCharacterId] = useState<Maybe<string>>(null);
  const [transactionsPage, setTransactionsPage] = useState<number>(0);
  const [journalPage, setJournalPage] = useState<number>(0);
  const [transactionsItemFilter, setTransactionsItemFilter] = useState<Maybe<string>>(null);
  const [transactionsOrder, setTransactionsOrder] = useState<Order>(Order.desc);
  const [transactionsOrderBy, setTransactionsOrderBy] = useState<WalletTransactionOrderBy>(WalletTransactionOrderBy.date);
  const [journalOrder, setJournalOrder] = useState<Order>(Order.desc);
  const [journalOrderBy, setJournalOrderby] = useState<WalletJournalOrderBy>(WalletJournalOrderBy.date);
  const [transactionsOrderType, setTransactionsOrderType] = useState<Maybe<OrderType>>(null);
  const [transactionsRowsPerPage, setTransactionsRowsPerPage] = useState(15);
  const [journalRowsPerPage, setJournalRowsPerPage] = useState(15);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
    setCurrentTab(newTab);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Wallet
          </Typography>
        </Toolbar>
        <Toolbar className={classes.labelToolbar}>
          <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
            <Tab label="Market Transactions" />
            <Tab label="Market Orders" />
            <Tab label="Journal" />
          </Tabs>
        </Toolbar>
        {currentTab === 0 && (
          <WalletTransactionsTab
            characterId={characterId}
            onCharacterChange={setCharacterId}
            itemFilter={transactionsItemFilter}
            page={transactionsPage}
            onItemFilterChange={setTransactionsItemFilter}
            order={transactionsOrder}
            orderBy={transactionsOrderBy}
            orderType={transactionsOrderType}
            onOrderChange={setTransactionsOrder}
            onOrderByChange={setTransactionsOrderBy}
            onOrderTypeChange={setTransactionsOrderType}
            onPageChange={setTransactionsPage}
            onRowsPerPageChange={setTransactionsRowsPerPage}
            rowsPerPage={transactionsRowsPerPage}
          />
        )}
        {currentTab === 2 && (
          <WalletJournalTab
            order={journalOrder}
            orderBy={journalOrderBy}
            page={journalPage}
            onPageChange={setJournalPage}
            onOrderChange={setJournalOrder}
            onOrderByChange={setJournalOrderby}
            rowsPerPage={journalRowsPerPage}
            onRowsPerPageChange={setJournalRowsPerPage}
          />
        )}
      </Paper>
    </div>
  );
};

export default withApollo(Wallet);
