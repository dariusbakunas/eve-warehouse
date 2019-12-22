import { createStyles, makeStyles, TableCellProps, TableProps, Theme } from '@material-ui/core';
import { Order } from '../__generated__/globalTypes';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
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

type colFn<Data extends {}> = (row: Data) => Maybe<string | number>;
type imageUrlFn<Data extends {}> = (row: Data) => string;
type classFn<Data extends {}> = (row: Data) => Maybe<string>;

interface IColumn<Data extends {}, OrderBy extends {}> {
  align?: TableCellProps['align'];
  cellClassName?: string | classFn<Data>;
  field: keyof Data | colFn<Data>;
  orderBy?: OrderBy;
  icon?: {
    label: string | colFn<Data>;
    imageUrl?: string | imageUrlFn<Data>;
  };
  title: string;
}

type IRowColumn<Data extends {}, OrderBy extends {}> = IColumn<Data, OrderBy> & {
  className?: Maybe<string>;
  value: string | number;
  cellIcon?: { label: string; imageUrl?: string };
};

interface IRow<Data extends {}, OrderBy extends {}> {
  id: string;
  columns: Array<IRowColumn<Data, OrderBy>>;
}

interface ITableProps<Data extends {}, OrderBy extends {}> extends TableProps {
  idField: keyof Data;
  columns: IColumn<Data, OrderBy>[];
  data: Maybe<Data[]>;
  sortingOptions?: {
    order?: Order;
    orderBy?: OrderBy;
    onOrderChange: (order: Order) => void;
    onOrderByChange: (orderBy: OrderBy) => void;
  };
  selectionOptions?: {
    selected: Set<string>;
    onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRowSelect: (event: React.MouseEvent<unknown>, id: string) => void;
    rowCount: number;
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
  selectionOptions,
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
                  value: `${column.field(entry)}`,
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

          if (column.cellClassName) {
            result.className = typeof column.cellClassName === 'function' ? column.cellClassName(entry) : column.cellClassName;
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
      const isDesc = sortingOptions.orderBy === column && sortingOptions.order === Order.desc;
      sortingOptions.onOrderChange(isDesc ? Order.asc : Order.desc);
      sortingOptions.onOrderByChange(column);
    }
  };

  const numSelected = selectionOptions ? selectionOptions.selected.size : 0;

  return (
    <div className={classes.tableWrapper}>
      <Table {...rest} className={classes.table}>
        <TableHead>
          <TableRow>
            {selectionOptions && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < selectionOptions.rowCount}
                  checked={numSelected === selectionOptions.rowCount}
                  onChange={selectionOptions.onSelectAll}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                />
              </TableCell>
            )}
            {columns.map(column => {
              return (
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
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            const isRowSelected = selectionOptions ? selectionOptions.selected.has(row.id) : false;
            const labelId = `table-checkbox-${row.id}`;

            const tableRowProps = selectionOptions
              ? {
                  hover: true,
                  role: 'checkbox',
                  'aria-checked': isRowSelected,
                  tabIndex: -1,
                  selected: isRowSelected,
                  onClick: (event: React.MouseEvent<unknown>) => selectionOptions.onRowSelect(event, row.id),
                }
              : {};

            return (
              <TableRow key={row.id} {...tableRowProps}>
                {selectionOptions && (
                  <TableCell padding="checkbox">
                    <Checkbox checked={isRowSelected} inputProps={{ 'aria-labelledby': labelId }} />
                  </TableCell>
                )}

                {row.columns.map((column, index) => {
                  return (
                    <TableCell key={index} align={column.align} className={column.className || undefined}>
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
                  );
                })}
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
