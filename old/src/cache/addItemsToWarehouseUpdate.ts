import { AddItemsToWarehouse, AddItemsToWarehouse_addItemsToWarehouse as Item } from '../__generated__/AddItemsToWarehouse';
import { alphaSort } from '../utils/sorting';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'apollo-link';
import {
  GetWarehouseItems,
  GetWarehouseItemsVariables,
  GetWarehouseItems_warehouse_items as WarehouseItem,
} from '../__generated__/GetWarehouseItems';
import getWarehouseItemsQuery from '../queries/getWarehouseItems.graphql';

export const addItemsToWarehouseUpdate = (store: DataProxy, { data }: FetchResult<AddItemsToWarehouse>) => {
  if (data && data.addItemsToWarehouse) {
    const warehouseId = data.addItemsToWarehouse[0].warehouse.id;
    let itemCache;

    try {
      itemCache = store.readQuery<GetWarehouseItems, GetWarehouseItemsVariables>({
        query: getWarehouseItemsQuery,
        variables: { id: data.addItemsToWarehouse[0].warehouse.id },
      });
    } catch (e) {
      // warehouse was never expanded, so there is no need to populate cache
      return;
    }

    if (itemCache && itemCache.warehouse && itemCache.warehouse.items) {
      const itemMap = data.addItemsToWarehouse.reduce<{ [key: string]: Item }>((acc, item) => {
        acc[item.item.id] = item;
        return acc;
      }, {});

      itemCache.warehouse.items = itemCache.warehouse.items.map(item => {
        const updateItem = itemMap[item.item.id];
        if (updateItem) {
          delete itemMap[item.item.id];
          return updateItem;
        } else {
          return item;
        }
      });

      if (Object.keys(itemMap).length) {
        const itemsToAdd = Object.keys(itemMap).map(key => itemMap[key]);
        itemCache.warehouse.items = itemCache.warehouse.items.concat(itemsToAdd).sort(alphaSort<WarehouseItem>(item => item.item.name));
      }

      store.writeQuery<GetWarehouseItems, GetWarehouseItemsVariables>({
        query: getWarehouseItemsQuery,
        data: itemCache,
        variables: { id: warehouseId },
      });
    }
  }
};
