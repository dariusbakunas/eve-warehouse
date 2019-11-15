import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo';
import { GetTransactions, GetTransactionsVariables } from '../__generated__/GetTransactions';
import getTransactionsQuery from '../queries/getTransactions.graphql';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Order, WalletTransactionOrderBy } from '../__generated__/globalTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2),
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    negative: {
      color: '#8b251f',
    },
    positive: {
      color: '#187119',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

const getTableData = (data?: GetTransactions) => {
  if (!data || !data.walletTransactions) {
    return {
      total: 0,
      rows: [],
    };
  }

  const {
    walletTransactions: { transactions, total },
  } = data;
  const rows = transactions.map(transaction => ({
    id: transaction.id,
    character: transaction.character ? transaction.character.name : 'N/A',
    client: transaction.client.name,
    date: moment(transaction.date).format('MM/DD/YYYY HH:mm'),
    item: transaction.item ? transaction.item.name : 'N/A',
    price: transaction.unitPrice,
    quantity: transaction.quantity,
    credit: transaction.credit,
  }));

  return {
    total: total,
    rows: rows,
  };
};

const Wallet = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState<Order>(Order.desc);
  const [orderBy, setOrderBy] = React.useState<WalletTransactionOrderBy>(WalletTransactionOrderBy.date);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { loading, data, error } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      orderBy: {
        column: orderBy,
        order: order,
      },
    },
  });

  const { rows, total } = getTableData(data);

  const handleSort = (event: React.MouseEvent<unknown>, column: WalletTransactionOrderBy) => {
    const isDesc = orderBy === column && order === Order.desc;
    setPage(0);
    setOrder(isDesc ? Order.asc : Order.desc);
    setOrderBy(column);
  };

  const sortableHeader = (column: WalletTransactionOrderBy, label: string) => (
    <TableSortLabel active={orderBy === column} direction={order} onClick={e => handleSort(e, column)}>
      {label}
      {orderBy === column ? <span className={classes.visuallyHidden}>{order === Order.desc ? 'sorted descending' : 'sorted ascending'}</span> : null}
    </TableSortLabel>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table size="small" aria-label="wallet transactions">
            <TableHead>
              <TableRow>
                <TableCell>{sortableHeader(WalletTransactionOrderBy.date, 'Date')}</TableCell>
                <TableCell>{sortableHeader(WalletTransactionOrderBy.character, 'Character')}</TableCell>
                <TableCell>{sortableHeader(WalletTransactionOrderBy.item, 'Item')}</TableCell>
                <TableCell align="right">{sortableHeader(WalletTransactionOrderBy.unitPrice, 'Price')}</TableCell>
                <TableCell align="right">{sortableHeader(WalletTransactionOrderBy.quantity, 'Quantity')}</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell>{sortableHeader(WalletTransactionOrderBy.client, 'Client')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.character}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.price.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                  <TableCell align="right" className={row.credit < 0 ? classes.negative : classes.positive}>
                    {row.credit.toLocaleString()}
                  </TableCell>
                  <TableCell>{row.client}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default withApollo(Wallet);
