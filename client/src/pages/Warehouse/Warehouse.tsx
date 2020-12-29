import { Accordion, AccordionItem, HeadingClickData, Loading } from 'carbon-components-react';
import { GetWarehouses } from '../../__generated__/GetWarehouses';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import { WarehouseItems } from './WarehouseItems';
import React, { useCallback, useState } from 'react';

const getWarehousesQuery = loader('../../queries/getWarehouses.graphql');

export const Warehouse: React.FC = () => {
  const { loading: warehousesLoading, data: warehousesResponse } = useQuery<GetWarehouses>(getWarehousesQuery);
  const [openWarehouses, setOpenWarehouses] = useState<Set<string>>(new Set());

  const loading = warehousesLoading;

  const handleWarehouseExpand = useCallback(
    (warehouseId: string, { isOpen }: HeadingClickData) => {
      setOpenWarehouses((prevOpen) => {
        const result = new Set(prevOpen);
        if (isOpen) {
          result.add(warehouseId);
        } else {
          result.delete(warehouseId);
        }

        return result;
      });
    },
    [setOpenWarehouses]
  );

  return (
    <React.Fragment>
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <div className="page-container warehouse">
        <h2>Warehouse</h2>
        <Accordion>
          {warehousesResponse &&
            warehousesResponse.warehouses.map((warehouse) => (
              <AccordionItem
                key={warehouse.id}
                onHeadingClick={(data: HeadingClickData) => handleWarehouseExpand(warehouse.id, data)}
                title={
                  <div className="warehouse-title">
                    <div>{warehouse.name}</div>
                    <div>{`Cost: ${warehouse.summary.totalCost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} ISK`}</div>
                    <div>{`Volume: ${warehouse.summary.totalVolume.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} m³`}</div>
                  </div>
                }
              >
                <WarehouseItems open={openWarehouses.has(warehouse.id)} warehouseId={warehouse.id} />
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </React.Fragment>
  );
};
