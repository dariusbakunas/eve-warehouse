import { DataTable } from '../../components/DataTable/DataTable';
import { DataTableRow } from 'carbon-components-react/lib/components/DataTable/DataTable';
import { GetWarehouseItems, GetWarehouseItemsVariables } from '../../__generated__/GetWarehouseItems';
import { loader } from 'graphql.macro';
import { Loading } from 'carbon-components-react';
import { useLazyQuery } from '@apollo/react-hooks';
import React, { useEffect, useMemo } from 'react';
import { getItemImageUrl } from '../../utils/getItemImageUrl';
import { ItemCell } from '../../components/ItemCell/ItemCell';

interface IWarehouseItemsProps {
  open: boolean;
  warehouseId: string;
}

interface IWarehouseItemRow extends DataTableRow {
  itemName: string;
  imageUrl: string;
  quantity: string;
  cost: string;
  costClassName: string;
  volume: string;
  jitaCost: string | null;
  total: string;
}

const getWarehouseItemsQuery = loader('../../queries/getWarehouseItems.graphql');

export const WarehouseItems: React.FC<IWarehouseItemsProps> = ({ open, warehouseId }) => {
  const [loadItems, { loading: itemsLoading, data: warehouseItemsResponse }] = useLazyQuery<GetWarehouseItems, GetWarehouseItemsVariables>(
    getWarehouseItemsQuery,
    {
      variables: {
        id: warehouseId,
      },
    }
  );

  useEffect(() => {
    if (open) {
      loadItems();
    }
  }, [open, loadItems]);

  const tableData = useMemo<IWarehouseItemRow[]>(() => {
    if (!warehouseItemsResponse || !warehouseItemsResponse.warehouse?.items.length) {
      return [];
    }

    return warehouseItemsResponse.warehouse.items.map((entry) => ({
      id: entry.item.id,
      itemName: entry.item.name,
      quantity: entry.quantity.toLocaleString(),
      imageUrl: getItemImageUrl(entry.item.id, entry.item.name),
      cost: entry.unitCost.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      costClassName: entry.item.jitaPrice?.buy ? (entry.item.jitaPrice.buy < entry.unitCost ? 'negative' : 'positive') : '',
      volume: (entry.quantity * entry.item.volume).toLocaleString(),
      jitaCost: entry.item.jitaPrice?.buy?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? null,
      total: (entry.unitCost * entry.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    }));
  }, [warehouseItemsResponse]);

  if (!open) {
    return null;
  }

  const loading = itemsLoading;

  return (
    <React.Fragment>
      {loading && <Loading description="Active loading indicator" withOverlay={false} />}
      <div className="warehouse-items">
        <DataTable<IWarehouseItemRow>
          columns={[
            { header: 'Name', key: 'itemName', isSortable: true, customRender: (row) => <ItemCell imageUrl={row.imageUrl} name={row.itemName} /> },
            { header: 'Quantity', key: 'quantity', isSortable: true, alignRight: true },
            { header: 'Unit Cost, ISK', key: 'cost', isSortable: true, alignRight: true, cellClassName: (row) => row.costClassName },
            { header: 'Jita Cost, ISK', key: 'jitaCost', isSortable: true, alignRight: true },
            { header: 'Volume, m³', key: 'volume', isSortable: true, alignRight: true },
            { header: 'Total, ISK', key: 'total', isSortable: true, alignRight: true },
          ]}
          rows={tableData}
          totalRows={tableData.length}
        />
      </div>
    </React.Fragment>
  );
};
