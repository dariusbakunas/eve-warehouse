import { GetBlueprints_blueprints_entries as Blueprint, GetBlueprints, GetBlueprintsVariables } from '../__generated__/GetBlueprints';
import { BlueprintsOrderBy, Order } from '../__generated__/globalTypes';
import { useQuery } from '@apollo/react-hooks';
import DataTable from './DataTable';
import getBlueprintsQuery from '../queries/getBlueprints.graphql';
import React, { useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const BlueprintsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<BlueprintsOrderBy>(BlueprintsOrderBy.name);

  const { loading, data } = useQuery<GetBlueprints, GetBlueprintsVariables>(getBlueprintsQuery, {
    variables: {
      orderBy: {
        column: orderBy,
        order: currentOrder as Order,
      },
      page: {
        index: currentPage,
        size: rowsPerPage,
      },
    },
  });

  const tableData = data ? data.blueprints.entries : null;

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  const handleOrderChange = (order: 'asc' | 'desc') => {
    setCurrentPage(0);
    setCurrentOrder(order);
  };

  const handleOrderByChange = (orderBy: BlueprintsOrderBy) => {
    setCurrentPage(0);
    setOrderBy(orderBy);
  };

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <DataTable<Blueprint, BlueprintsOrderBy>
        idField="id"
        columns={[
          { field: 'name', title: 'Name', orderBy: BlueprintsOrderBy.name },
          { field: 'materialEfficiency', title: 'ME', align: 'right', orderBy: BlueprintsOrderBy.materialEfficiency },
          { field: 'timeEfficiency', title: 'TE', align: 'right', orderBy: BlueprintsOrderBy.timeEfficiency },
          { field: row => (row.maxRuns === -1 ? '∞' : row.maxRuns), title: 'Runs Remaining', align: 'right', orderBy: BlueprintsOrderBy.maxRuns },
          { field: row => row.character.name, title: 'Character', orderBy: BlueprintsOrderBy.character },
        ]}
        data={tableData}
        sortingOptions={{
          order: currentOrder,
          orderBy: orderBy,
          onOrderByChange: handleOrderByChange,
          onOrderChange: handleOrderChange,
        }}
        size="small"
        aria-label="blueprints table"
        pagingOptions={{
          page: currentPage,
          rowCount: data ? data.blueprints.total : 0,
          rowsPerPage: rowsPerPage,
          onChangePage: (event, newPage) => setCurrentPage(newPage),
          onChangeRowsPerPage: handleChangeRowsPerPage,
        }}
      />
    </React.Fragment>
  );
};

export default BlueprintsTab;
