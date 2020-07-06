import { DataTable, IDataTableHeader } from '../../components/DataTable/DataTable';
import { DataTableRow, Loading } from 'carbon-components-react';
import {
  GetTransactions,
  GetTransactionsVariables,
  GetTransactions_walletTransactions_transactions as WalletTransaction,
} from '../../__generated__/GetTransactions';
import { loader } from 'graphql.macro';
import { Order, WalletTransactionOrderBy } from '../../__generated__/globalTypes';
import { useNotification } from '../../components/Notifications/useNotifications';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { getItemImageUrl } from '../../utils/getItemImageUrl';
import { ItemCell } from '../../components/ItemCell/ItemCell';

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
}

export const Transactions: React.FC = () => {
  const { enqueueNotification } = useNotification();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>(Order.desc);
  const [orderBy, setOrderBy] = useState<WalletTransactionOrderBy>(WalletTransactionOrderBy.date);

  const { loading: transactionsLoading, data: transactionsResponse } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      filter: {
        characterId: null,
      },
      orderBy: {
        column: orderBy,
        order: order,
      },
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
      };
    });
  }, [transactionsResponse]);

  const loading = transactionsLoading;

  return (
    <React.Fragment>
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <DataTable<ITransactionRow>
        columns={[
          { header: 'Date', key: 'date' },
          { header: 'Character', key: 'character' },
          { header: 'Item', key: 'item', customRender: (row) => <ItemCell imageUrl={row.imageUrl} name={row.itemName} /> },
          { header: 'Group', key: 'group' },
          { header: 'Price', key: 'unitPrice', alignRight: true },
          { header: 'Quantity', key: 'quantity', alignRight: true },
          { header: 'Credit', key: 'credit', alignRight: true },
          { header: 'Station', key: 'station' },
        ]}
        rows={tableData}
      />
    </React.Fragment>
  );
};
