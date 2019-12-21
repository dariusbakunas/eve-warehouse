import { createStyles, makeStyles, TableCellProps, TableProps, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useMemo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      whiteSpace: 'nowrap',
    },
    iconCell: {
      display: 'flex',
      alignItems: 'center',
    },
    cellIcon: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
    },
    tableWrapper: {
      overflowX: 'scroll',
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

type colFn<Data extends {}> = (row: Data) => string | number;
type imageUrlFn<Data extends {}> = (row: Data) => string;

interface IColumn<Data extends {}, OrderBy extends {}> {
  align?: TableCellProps['align'];
  field: keyof Data | colFn<Data>;
  orderBy?: OrderBy;
  icon?: {
    label: string | colFn<Data>;
    imageUrl?: string | imageUrlFn<Data>;
  };
  title: string;
}

type IRowColumn<Data extends {}, OrderBy extends {}> = IColumn<Data, OrderBy> & { value: string | number; cellIcon?: { label: string; imageUrl?: string } };

interface IRow<Data extends {}, OrderBy extends {}> {
  id: string;
  columns: Array<IRowColumn<Data, OrderBy>>;
}

interface ITableProps<Data extends {}, OrderBy extends {}> extends TableProps {
  idField: keyof Data;
  columns: IColumn<Data, OrderBy>[];
  data: Maybe<Data[]>;
  sortingOptions?: {
    order?: 'desc' | 'asc';
    orderBy?: OrderBy;
    onOrderChange: (order: 'desc' | 'asc') => void;
    onOrderByChange: (orderBy: OrderBy) => void;
  };
  pagingOptions?: {
    page: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    rowsPerPage: number;
    rowCount: number;
  };
}

const DataTable = <Data extends {}, OrderBy extends {}>({
  columns,
  data,
  idField,
  sortingOptions,
  pagingOptions,
  ...rest
}: ITableProps<Data, OrderBy>) => {
  const classes = useStyles();

  const rows: IRow<Data, OrderBy>[] = useMemo(() => {
    if (data) {
      return data.map(entry => {
        const rowColumns = columns.map(column => {
          const result: IRowColumn<Data, OrderBy> =
            typeof column.field === 'function'
              ? {
                  ...column,
                  value: column.field(entry),
                }
              : {
                  ...column,
                  value: `${entry[column.field]}`,
                };

          if (column.icon) {
            result.cellIcon = {
              label: typeof column.icon.label === 'function' ? `${column.icon.label(entry)}` : column.icon.label,
            };

            if (column.icon.imageUrl) {
              result.cellIcon.imageUrl = typeof column.icon.imageUrl === 'function' ? column.icon.imageUrl(entry) : column.icon.imageUrl;
            }
          }

          return result;
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

  const handleSort = (event: React.MouseEvent<unknown>, column: OrderBy) => {
    if (sortingOptions) {
      const isDesc = sortingOptions.orderBy === column && sortingOptions.order === 'desc';
      sortingOptions.onOrderChange(isDesc ? 'asc' : 'desc');
      sortingOptions.onOrderByChange(column);
    }
  };

  return (
    <div className={classes.tableWrapper}>
      <Table {...rest} className={classes.table}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.title} align={column.align}>
                {sortingOptions && column.orderBy ? (
                  <TableSortLabel
                    active={sortingOptions.orderBy === column.orderBy}
                    direction={sortingOptions.order}
                    onClick={e => handleSort(e, column.orderBy!)}
                  >
                    {column.title}
                    {sortingOptions.orderBy === column.orderBy! ? (
                      <span className={classes.visuallyHidden}>{sortingOptions.order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  column.title
                )}
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
                    {column.cellIcon ? (
                      <div className={classes.iconCell}>
                        <div className={classes.cellIcon}>
                          <Avatar variant="square" src={column.cellIcon.imageUrl}>
                            {column.cellIcon.label}
                          </Avatar>
                        </div>
                        {column.value}
                      </div>
                    ) : (
                      column.value
                    )}
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
