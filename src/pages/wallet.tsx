import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo';
import { GetTransactions, GetTransactionsVariables } from '../__generated__/GetTransactions';
import getTransactionsQuery from '../queries/getTransactions.graphql';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

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
    client: transaction.client.name,
    date: moment(transaction.date).format('MM/DD/YYYY HH:mm'),
    item: transaction.item ? transaction.item.name : 'N/A',
    price: transaction.unitPrice,
    quantity: transaction.quantity,
    credit: transaction.unitPrice * transaction.quantity * (transaction.isBuy ? -1 : 1),
  }));

  return {
    total: total,
    rows: rows,
  };
};

const Wallet = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    },
  });

  const { rows, total } = getTableData(data);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table size="small" aria-label="wallet transactions">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Item</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell align="right">{row.price.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.quantity.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.credit.toLocaleString()}</TableCell>
                  <TableCell>{row.client}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
