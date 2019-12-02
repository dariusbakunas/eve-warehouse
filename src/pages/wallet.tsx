import React, { ChangeEvent, useCallback, useState } from 'react';
import withApollo from '../lib/withApollo';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import WalletTransactionsTab from '../components/WalletTransactionsTab';
import Maybe from 'graphql/tsutils/Maybe';
import { MarketOrderOrderBy, Order, OrderStateFilter, OrderType, WalletJournalOrderBy, WalletTransactionOrderBy } from '../__generated__/globalTypes';
import WalletJournalTab from '../components/WalletJournalTab';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { useQuery } from '@apollo/react-hooks';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { GetCharacterNames } from '../__generated__/GetCharacterNames';
import getCharacterNames from '../queries/getCharacterNames.graphql';
import debounce from 'lodash.debounce';
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@material-ui/core/Checkbox';
import WalletOrdersTab from '../components/WalletOrdersTab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    filterMenu: {
      width: '250px',
      padding: theme.spacing(2),
    },
    filterFormControl: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    paper: {
      width: 'calc(100vw - 120px)',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    title: {
      marginRight: '20px',
      flex: 1,
    },
    labelToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const Wallet = () => {
  const classes = useStyles();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLButtonElement | null>(null);
  const [characterFilter, setCharacterFilter] = useState<Maybe<{ id: string; name: string }>>(null);
  const [transactionsPage, setTransactionsPage] = useState<number>(0);
  const [ordersPage, setOrdersPage] = useState<number>(0);
  const [journalPage, setJournalPage] = useState<number>(0);
  const [transactionsItemFilter, setTransactionsItemFilter] = useState<Maybe<string>>(null);
  const [transactionsOrder, setTransactionsOrder] = useState<Order>(Order.desc);
  const [transactionsOrderBy, setTransactionsOrderBy] = useState<WalletTransactionOrderBy>(WalletTransactionOrderBy.date);
  const [journalOrder, setJournalOrder] = useState<Order>(Order.desc);
  const [marketOrder, setMarketOrder] = useState<Order>(Order.desc);
  const [journalOrderBy, setJournalOrderby] = useState<WalletJournalOrderBy>(WalletJournalOrderBy.date);
  const [marketOrderBy, setMarketOrderBy] = useState<MarketOrderOrderBy>(MarketOrderOrderBy.issued);
  const [transactionsOrderType, setTransactionsOrderType] = useState<Maybe<OrderType>>(null);
  const [transactionsRowsPerPage, setTransactionsRowsPerPage] = useState(15);
  const [journalRowsPerPage, setJournalRowsPerPage] = useState(15);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(15);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [orderStateFilter, setOrderStateFilter] = React.useState<OrderStateFilter>({
    active: true,
    expired: false,
    cancelled: false,
  });

  const { loading: characterNamesLoading, data: characterNamesData } = useQuery<GetCharacterNames>(getCharacterNames);

  const handleOpenFilerMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
    setCurrentTab(newTab);
  };

  const filterMenuOpen = Boolean(filterMenuAnchor);

  const handleBuySellChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setTransactionsPage(0);
    if (value === 'all') {
      setTransactionsOrderType(null);
    } else {
      setTransactionsOrderType(value === 'buy' ? OrderType.buy : OrderType.sell);
    }
  };

  const handleCharacterChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setTransactionsPage(0);
    if (value === 'all' || !characterNamesData) {
      setCharacterFilter(null);
    } else {
      const character = characterNamesData.characters.find(character => character.id === value);
      if (character) {
        setCharacterFilter({ id: character.id, name: character.name });
      }
    }
  };

  const setItemFilterDebounced = debounce(filter => {
    setTransactionsPage(0);
    setTransactionsItemFilter(filter);
  }, 500);

  const handleItemFilterChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value as string;

    if (value.length) {
      setItemFilterDebounced(value);
    } else {
      setItemFilterDebounced(null);
    }
  }, []);

  const handleOrderStateFilterChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderStateFilter({ ...orderStateFilter, [name]: event.target.checked });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Wallet
          </Typography>
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list" aria-labelledby="filterMenu" onClick={handleOpenFilerMenu}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
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
            characterFilter={characterFilter}
            onClearCharacterFilter={() => setCharacterFilter(null)}
            itemFilter={transactionsItemFilter}
            page={transactionsPage}
            onClearItemFilter={() => setTransactionsItemFilter(null)}
            order={transactionsOrder}
            orderBy={transactionsOrderBy}
            orderType={transactionsOrderType}
            onOrderChange={setTransactionsOrder}
            onOrderByChange={setTransactionsOrderBy}
            onClearOrderTypeFilter={() => setTransactionsOrderType(null)}
            onPageChange={setTransactionsPage}
            onRowsPerPageChange={setTransactionsRowsPerPage}
            rowsPerPage={transactionsRowsPerPage}
          />
        )}
        {currentTab === 1 && (
          <WalletOrdersTab
            orderStateFilter={orderStateFilter}
            characterFilter={characterFilter}
            onPageChange={setOrdersPage}
            order={marketOrder}
            orderBy={marketOrderBy}
            onClearCharacterFilter={() => setCharacterFilter(null)}
            onOrderStateFilterChange={setOrderStateFilter}
            onRowsPerPageChange={setOrderRowsPerPage}
            onOrderChange={setMarketOrder}
            onOrderByChange={setMarketOrderBy}
            page={ordersPage}
            rowsPerPage={orderRowsPerPage}
          />
        )}
        {currentTab === 2 && (
          <WalletJournalTab
            characterFilter={characterFilter}
            order={journalOrder}
            orderBy={journalOrderBy}
            page={journalPage}
            onClearCharacterFilter={() => setCharacterFilter(null)}
            onPageChange={setJournalPage}
            onOrderChange={setJournalOrder}
            onOrderByChange={setJournalOrderby}
            rowsPerPage={journalRowsPerPage}
            onRowsPerPageChange={setJournalRowsPerPage}
          />
        )}
      </Paper>
      <Popover
        id="filterMenu"
        open={filterMenuOpen}
        anchorEl={filterMenuAnchor}
        onClose={handleCloseFilterMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper className={classes.filterMenu}>
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="character-label">Character</InputLabel>
            <Select
              labelId="character-label"
              id="character-select"
              onChange={handleCharacterChange}
              value={characterFilter ? characterFilter.id : 'all'}
            >
              <MenuItem value={'all'}>All</MenuItem>
              {characterNamesData &&
                characterNamesData.characters.map(character => (
                  <MenuItem key={character.id} value={character.id}>
                    {character.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {currentTab === 0 && (
            <React.Fragment>
              <FormControl className={classes.filterFormControl}>
                <InputLabel id="order-type-label">Buy/Sell</InputLabel>
                <Select labelId="order-type-label" id="order-type-select" onChange={handleBuySellChange} value={transactionsOrderType || 'all'}>
                  <MenuItem value={'all'}>Both</MenuItem>
                  <MenuItem value={'buy'}>Buy</MenuItem>
                  <MenuItem value={'sell'}>Sell</MenuItem>
                </Select>
              </FormControl>
              <FormControl className={classes.filterFormControl}>
                <InputLabel htmlFor="item-search-label">Item</InputLabel>
                <Input
                  id="item-search-input"
                  onChange={handleItemFilterChange}
                  defaultValue={transactionsItemFilter}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </React.Fragment>
          )}
          {currentTab === 1 && (
            <React.Fragment>
              <FormControl component="fieldset" className={classes.filterFormControl}>
                <FormLabel component="legend">Order State</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={!!orderStateFilter.active} onChange={handleOrderStateFilterChange('active')} value="active" />}
                    label="Active"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={!!orderStateFilter.expired} onChange={handleOrderStateFilterChange('expired')} value="expired" />}
                    label="Expired"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={!!orderStateFilter.cancelled} onChange={handleOrderStateFilterChange('cancelled')} value="cancelled" />
                    }
                    label="Cancelled"
                  />
                </FormGroup>
              </FormControl>
            </React.Fragment>
          )}
        </Paper>
      </Popover>
    </div>
  );
};

export default withApollo(Wallet);
