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
import clsx from 'clsx';
import React, { PropsWithChildren, ReactNode, useMemo } from 'react';

export interface IDataTableHeader<R extends DataTableRow, K extends string = string> extends DataTableHeader<K> {
  customRender?: (row: R) => React.ReactNode;
  alignRight?: boolean;
  cellClassName?: (row: R) => React.HTMLAttributes<HTMLElement>['className'];
}

interface IDataTableProps<R extends DataTableRow, H extends IDataTableHeader<R>> {
  withSearch?: boolean;
  description?: React.ReactNode;
  columns: IDataTableHeader<R>[];
  rows: DataTableProps<R, H>['rows'];
  title?: React.ReactNode;
  toolbarItems?: ReactNode;
}

export const DataTable = <R extends DataTableRow = DataTableRow, H extends IDataTableHeader<R> = IDataTableHeader<R>>({
  description,
  columns,
  rows,
  title,
  withSearch,
  toolbarItems,
}: PropsWithChildren<IDataTableProps<R, H>>): React.ReactElement<PropsWithChildren<IDataTableProps<R, H>>> => {
  const withToolbar = !!(withSearch || toolbarItems);

  const rowIdMap = useMemo(() => {
    return rows.reduce<{ [key: string]: R }>((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});
  }, [rows]);

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
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const className = clsx({
                      'align-right': header.alignRight,
                    });

                    return (
                      <TableHeader className={className} {...getHeaderProps({ header })} key={header.key}>
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
                      const cellClassName = header.cellClassName ? header.cellClassName(originalRow) : null;

                      const className = clsx(cellClassName, {
                        'align-right': header.alignRight,
                      });

                      const customRender = headers[cellIndex].customRender;
                      const value = customRender ? customRender(originalRow) : cell.value;
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
