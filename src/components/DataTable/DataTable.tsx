import {
  DataTable as CarbonTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from 'carbon-components-react';
import { DataTableHeader, DataTableProps, DataTableRow } from 'carbon-components-react/lib/components/DataTable/DataTable';
import { DataTableSortState } from 'carbon-components-react/lib/components/DataTable/state/sorting';
import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode, useCallback, useMemo } from 'react';

export interface IDataTableHeader<R extends DataTableRow> extends DataTableHeader<Extract<keyof R, string>> {
  customRender?: (row: R) => React.ReactNode;
  alignRight?: boolean;
  cellClassName?: (row: R) => React.HTMLAttributes<HTMLElement>['className'];
  isSortable?: boolean;
}

interface IDataTableProps<R extends DataTableRow> {
  withSearch?: boolean;
  description?: React.ReactNode;
  columns: IDataTableHeader<R>[];
  rows: DataTableProps<R, IDataTableHeader<R>>['rows'];
  title?: React.ReactNode;
  toolbarItems?: ReactNode;
  onOrderChange?: (orderBy: Extract<keyof R, string>) => void;
  orderBy?: Extract<keyof R, string>;
  sortDirection?: DataTableSortState;
}

export const DataTable = <R extends DataTableRow = DataTableRow>({
  description,
  columns,
  rows,
  title,
  withSearch,
  toolbarItems,
  orderBy,
  sortDirection,
  onOrderChange,
}: PropsWithChildren<IDataTableProps<R>>): React.ReactElement<PropsWithChildren<IDataTableProps<R>>> => {
  const withToolbar = !!(withSearch || toolbarItems);

  const rowIdMap = useMemo(() => {
    return rows.reduce<{ [key: string]: R }>((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});
  }, [rows]);

  const handleHeaderClick = useCallback(
    (header: IDataTableHeader<R>) => {
      if (header.isSortable && onOrderChange) {
        onOrderChange(header.key);
      }
    },
    [onOrderChange]
  );

  return (
    <CarbonTable
      headers={columns}
      rows={rows}
      render={({ rows, headers, getHeaderProps, getRowProps, getTableProps, onInputChange }) => {
        return (
          <TableContainer title={title} description={description}>
            {withToolbar && (
              <TableToolbar>
                <TableToolbarContent>
                  {withSearch && <TableToolbarSearch onChange={onInputChange} />}
                  {toolbarItems}
                </TableToolbarContent>
              </TableToolbar>
            )}
            <Table {...getTableProps()} isSortable={true}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const className = clsx({
                      'align-right': header.alignRight,
                    });

                    const isSortHeader = header.isSortable && header.key === orderBy;
                    const areaSort = sortDirection === 'ASC' ? 'ascending' : sortDirection === 'DESC' ? 'descending' : 'none';

                    return (
                      <TableHeader
                        className={className}
                        {...getHeaderProps({ header })}
                        key={header.key}
                        isSortHeader={isSortHeader}
                        sortDirection={sortDirection}
                        aria-sort={areaSort}
                        isSortable={header.isSortable}
                        onClick={(e) => handleHeaderClick(header)}
                      >
                        {header.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell, cellIndex) => {
                      const header = headers[cellIndex];
                      const originalRow = rowIdMap[row.id];
                      const cellClassName = header.cellClassName && originalRow ? header.cellClassName(originalRow) : null;

                      const className = clsx(cellClassName, {
                        'align-right': header.alignRight,
                      });

                      const customRender = headers[cellIndex].customRender;
                      const value = customRender && originalRow ? customRender(originalRow) : cell.value;
                      return (
                        <TableCell className={className} key={cell.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }}
    />
  );
};
