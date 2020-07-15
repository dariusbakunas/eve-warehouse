import { DataTable, IDataTableHeader } from '../../components/DataTable/DataTable';
import { DataTableRow, Loading, Pagination } from 'carbon-components-react';
import { DataTableSortState } from 'carbon-components-react/lib/components/DataTable/state/sorting';
import { getItemImageUrl } from '../../utils/getItemImageUrl';
import { GetTransactions, GetTransactionsVariables } from '../../__generated__/GetTransactions';
import { ItemCell } from '../../components/ItemCell/ItemCell';
import { loader } from 'graphql.macro';
import { Order, WalletTransactionOrderBy, WalletTransactionOrderByInput } from '../../__generated__/globalTypes';
import { useNotification } from '../../components/Notifications/useNotifications';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';

const getTransactionsQuery = loader('../../queries/getTransactions.graphql');

interface ITransactionRow extends DataTableRow {
  date: string;
  character: string | null;
  itemName: string | null;
  group: string | null;
  imageUrl: string | null;
  unitPrice: string;
  quantity: string;
  credit: string;
  station: string;
  isBuy: boolean;
}

export const Transactions: React.FC = () => {
  const { enqueueNotification } = useNotification();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState<DataTableSortState>('DESC');
  const [orderBy, setOrderBy] = useState<Extract<keyof ITransactionRow, string>>(WalletTransactionOrderBy.date);

  const gqlOrderBy: WalletTransactionOrderByInput | null = useMemo(() => {
    let column;

    if (orderBy in WalletTransactionOrderBy) {
      column = orderBy as WalletTransactionOrderBy;
    }

    switch (orderBy) {
      case 'itemName':
        column = WalletTransactionOrderBy.item;
        break;
      case 'group':
        column = WalletTransactionOrderBy.invGroup;
        break;
    }

    if (column && sortDirection !== 'NONE') {
      return {
        column: column,
        order: sortDirection === 'ASC' ? Order.asc : Order.desc,
      };
    } else {
      return null;
    }
  }, [sortDirection, orderBy]);

  const { loading: transactionsLoading, data: transactionsResponse } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      filter: {
        characterId: null,
      },
      orderBy: gqlOrderBy,
    },
    onError: (error) => {
      enqueueNotification(`Wallet transactions failed to load: ${error.message}`, null, { kind: 'error' });
    },
  });

  const tableData: ITransactionRow[] = useMemo(() => {
    if (!transactionsResponse || !transactionsResponse.walletTransactions) {
      return [];
    }

    return transactionsResponse.walletTransactions.transactions.map((entry) => {
      return {
        id: entry.id,
        credit: entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        date: moment(entry.date).format('MM/DD/YYYY HH:mm'),
        character: entry.character ? entry.character.name : null,
        itemName: entry.item.name,
        group: entry.item.invGroup.name,
        imageUrl: getItemImageUrl(entry.item.id, entry.item.name),
        unitPrice: entry.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        quantity: entry.quantity.toLocaleString(),
        station: entry.location.name,
        isBuy: entry.isBuy,
      };
    });
  }, [transactionsResponse]);

  const handlePagingChange = useCallback(
    (data: { page: number; pageSize: number }) => {
      setPage(data.page - 1);
      setRowsPerPage(data.pageSize);
    },
    [setPage, setRowsPerPage]
  );

  const handleOrderChange = useCallback(
    (key: Extract<keyof ITransactionRow, string>) => {
      let newSortDirection: DataTableSortState;

      if (key === orderBy) {
        switch (sortDirection) {
          case 'ASC':
            newSortDirection = 'DESC';
            break;
          case 'DESC':
            newSortDirection = 'NONE';
            break;
          case 'NONE':
            newSortDirection = 'ASC';
        }
      } else {
        newSortDirection = 'ASC';
        setOrderBy(key);
      }

      setPage(0);
      setSortDirection(newSortDirection);
    },
    [sortDirection, orderBy]
  );

  const loading = transactionsLoading;

  return (
    <React.Fragment>
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <DataTable<ITransactionRow>
        columns={[
          { header: 'Date', key: 'date', isSortable: true },
          { header: 'Character', key: 'character', isSortable: true },
          { header: 'Item', key: 'itemName', customRender: (row) => <ItemCell imageUrl={row.imageUrl} name={row.itemName} />, isSortable: true },
          { header: 'Group', key: 'group', isSortable: true },
          { header: 'Price', key: 'unitPrice', alignRight: true, isSortable: true },
          { header: 'Quantity', key: 'quantity', alignRight: true, isSortable: true },
          { header: 'Credit', key: 'credit', alignRight: true, cellClassName: (row) => (row.isBuy ? 'negative' : 'positive'), isSortable: true },
          { header: 'Station', key: 'station', isSortable: true },
        ]}
        rows={tableData}
        orderBy={orderBy}
        sortDirection={sortDirection}
        onOrderChange={handleOrderChange}
      />
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        onChange={handlePagingChange}
        pageSizes={[10, 20, 30, 40, 50]}
        page={page + 1}
        pageSize={rowsPerPage}
        totalItems={transactionsResponse?.walletTransactions.total}
      />
    </React.Fragment>
  );
};
