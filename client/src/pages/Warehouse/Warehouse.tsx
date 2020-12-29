import { Accordion, AccordionItem, Loading } from 'carbon-components-react';
import { GetWarehouses } from '../../__generated__/GetWarehouses';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

const getWarehousesQuery = loader('../../queries/getWarehouses.graphql');

export const Warehouse: React.FC = () => {
  const { loading: warehousesLoading, data: warehousesResponse } = useQuery<GetWarehouses>(getWarehousesQuery);

  const loading = warehousesLoading;

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
                title={
                  <div className="warehouse-title">
                    <div>{warehouse.name}</div>
                    <div>{`Cost: ${warehouse.summary.totalCost.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })} ISK`}</div>
                    <div>{`Volume: ${warehouse.summary.totalVolume.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}</div>
                  </div>
                }
              >
                test
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </React.Fragment>
  );
};
