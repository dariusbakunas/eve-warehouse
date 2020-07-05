import {
  DataTable as CarbonTable,
  DataTableCell,
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
import React, { PropsWithChildren, ReactNode } from 'react';

export interface IDataTableHeader<K extends string = string> extends DataTableHeader<K> {
  customRender?: (cell: DataTableCell<any, DataTableHeader<string>>) => React.ReactNode;
}

interface IDataTableProps<R extends DataTableRow, H extends IDataTableHeader> {
  withSearch?: boolean;
  description?: React.ReactNode;
  columns: DataTableProps<R, H>['headers'];
  rows: DataTableProps<R, H>['rows'];
  title?: React.ReactNode;
  toolbarItems?: ReactNode;
}

export const DataTable = <R extends DataTableRow = DataTableRow, H extends IDataTableHeader = IDataTableHeader>({
  description,
  columns,
  rows,
  title,
  withSearch,
  toolbarItems,
}: PropsWithChildren<IDataTableProps<R, H>>): React.ReactElement<PropsWithChildren<IDataTableProps<R, H>>> => {
  const withToolbar = !!(withSearch || toolbarItems);

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
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell, cellIndex) => {
                      const customRender = headers[cellIndex].customRender;
                      const value = customRender ? customRender(cell) : cell.value;
                      return <TableCell key={cell.id}>{value}</TableCell>;
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
