import { GetCharacterNames_characters as Character, GetCharacterNames } from '../../__generated__/GetCharacterNames';
import { DataTable } from '../../components/DataTable/DataTable';
import { DataTableRow, Loading, Pagination } from 'carbon-components-react';
import { DataTableSortState } from 'carbon-components-react/lib/components/DataTable/state/sorting';
import { getItemImageUrl } from '../../utils/getItemImageUrl';
import { GetTransactionIds, GetTransactionIdsVariables } from '../../__generated__/GetTransactionIds';
import { GetTransactions, GetTransactionsVariables } from '../../__generated__/GetTransactions';
import { ItemCell } from '../../components/ItemCell/ItemCell';
import { loader } from 'graphql.macro';
import { Order, WalletTransactionOrderBy, WalletTransactionOrderByInput } from '../../__generated__/globalTypes';
import { OverflowMultiselect } from '../../components/OverflowMultiselect/OverflowMultiselect';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useNotification } from '../../components/Notifications/useNotifications';
import { User32 } from '@carbon/icons-react';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';

const getCharacterNamesQuery = loader('../../queries/getCharacterNames.graphql');
const getTransactionsQuery = loader('../../queries/getTransactions.graphql');
const getTransactionIdsQuery = loader('../../queries/getTransactionIds.graphql');

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
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState<DataTableSortState>('DESC');
  const [orderBy, setOrderBy] = useState<Extract<keyof ITransactionRow, string>>(WalletTransactionOrderBy.date);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [itemFilter, setItemFilter] = useState<string | null>();

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

  const { loading: characterNamesLoading, data: characterResponse } = useQuery<GetCharacterNames>(getCharacterNamesQuery);

  const { loading: transactionsLoading, data: transactionsResponse } = useQuery<GetTransactions, GetTransactionsVariables>(getTransactionsQuery, {
    variables: {
      page: {
        index: page,
        size: rowsPerPage,
      },
      filter: {
        item: itemFilter,
        characterIds: selectedCharacters,
      },
      orderBy: gqlOrderBy,
    },
    onError: (error) => {
      enqueueNotification(`Wallet transactions failed to load: ${error.message}`, null, { kind: 'error' });
    },
  });

  const [getTransactionIds, { loading: idsLoading }] = useLazyQuery<GetTransactionIds, GetTransactionIdsVariables>(getTransactionIdsQuery, {
    variables: {
      filter: {
        item: itemFilter,
        characterIds: selectedCharacters,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setSelectedRows(new Set(data.walletTransactionIds));
    },
    onError: (error) => {
      enqueueNotification(`Wallet transactions ids failed to load: ${error.message}`, null, { kind: 'error' });
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

  const handleRowSelect = useCallback(
    (rowId: string, selected: boolean) => {
      setSelectedRows((prevRows) => {
        const newSelected = new Set(prevRows);
        if (selected) {
          newSelected.add(rowId);
        } else {
          newSelected.delete(rowId);
        }

        return newSelected;
      });
    },
    [setSelectedRows]
  );

  const handleSearch = useCallback(
    _.debounce((input: string | null) => {
      setPage(1);
      if (input && input.length) {
        setItemFilter(input);
      } else {
        setItemFilter(null);
      }
    }, 500),
    [setItemFilter]
  );

  const totalRows = transactionsResponse?.walletTransactions.total ?? 0;

  const handleSelectAllRows = useCallback(
    (select: boolean) => {
      if (select) {
        if (totalRows > tableData.length) {
          // we have paged data, get all row ids
          getTransactionIds();
        } else {
          // we only have single page, use existing ids
          const ids = tableData.map((row) => row.id);
          setSelectedRows(new Set(ids));
        }
      } else {
        setSelectedRows(new Set());
      }
    },
    [tableData, totalRows, getTransactionIds]
  );

  const handleCharacterFilterChange = useCallback(({ selectedItems }: { selectedItems: Character[] }) => {
    setPage(1);
    setSelectedCharacters(selectedItems.map((character) => character.id));
  }, []);

  const toolbarItems = (
    <React.Fragment>
      <OverflowMultiselect<Character>
        className="bx--toolbar-action"
        flipped={true}
        id="character-filter"
        initialSelectedItems={[]}
        itemToString={(character) => character?.name || ''}
        items={characterResponse ? characterResponse.characters : []}
        onChange={handleCharacterFilterChange}
        renderIcon={User32}
      />
    </React.Fragment>
  );

  const loading = transactionsLoading || idsLoading || characterNamesLoading;

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
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        totalRows={totalRows}
        onAllSelect={handleSelectAllRows}
        onSearch={handleSearch}
        withSearch={true}
        toolbarItems={toolbarItems}
      />
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        onChange={handlePagingChange}
        pageSizes={[10, 20, 30, 40, 50]}
        page={page + 1}
        pageSize={rowsPerPage}
        totalItems={totalRows}
      />
    </React.Fragment>
  );
};
