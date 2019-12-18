import { createStyles, makeStyles, TableCellProps, TableProps, Theme } from '@material-ui/core';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useMemo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap',
    },
    tableWrapper: {
      overflowX: 'scroll',
    },
  })
);

type colFn<Data extends {}> = (row: Data) => string | number;

interface IColumn<Data extends {}> {
  align?: TableCellProps['align'];
  field: keyof Data | colFn<Data>;
  sortable?: boolean;
  title: string;
}

interface IRow<Data extends {}> {
  id: string;
  columns: Array<IColumn<Data> & { value: string | number }>;
}

interface ITableProps<Data extends {}> extends TableProps {
  idField: keyof Data;
  columns: IColumn<Data>[];
  data: Maybe<Data[]>;
  pagingOptions?: {
    page: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    rowsPerPage: number;
    rowCount: number;
  };
}

const DataTable = <Data extends {}>({ columns, data, idField, pagingOptions, ...rest }: ITableProps<Data>) => {
  const classes = useStyles();

  const rows: IRow<Data>[] = useMemo(() => {
    if (data) {
      return data.map(entry => {
        const rowColumns = columns.map(column => {
          if (typeof column.field === 'function') {
            return {
              ...column,
              value: column.field(entry),
            };
          } else {
            return {
              ...column,
              value: `${entry[column.field]}`,
            };
          }
        });
        return {
          id: `${entry[idField]}`,
          columns: rowColumns,
        };
      });
    } else {
      return [];
    }
  }, [data]);

  return (
    <div className={classes.tableWrapper}>
      <Table {...rest} className={classes.table}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.title} align={column.align}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.id}>
                {row.columns.map((column, index) => (
                  <TableCell key={index} align={column.align}>
                    {column.value}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {pagingOptions && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={pagingOptions.rowCount}
          rowsPerPage={pagingOptions.rowsPerPage}
          page={pagingOptions.page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={pagingOptions.onChangePage}
          onChangeRowsPerPage={pagingOptions.onChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default DataTable;
