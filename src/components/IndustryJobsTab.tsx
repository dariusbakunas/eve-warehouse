import { GetIndustryJobs, GetIndustryJobsVariables, GetIndustryJobs_industryJobs_jobs as IndustryJob } from '../__generated__/GetIndustryJobs';
import { getItemImageUrl } from '../utils/getItemImageUrl';
import { IndustryJobOrderBy } from '../__generated__/globalTypes';
import { LinearProgress } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import DataTable from './DataTable';
import getIndustryJobsQuery from '../queries/getIndustryJobs.graphql';
import moment from 'moment';
import React, { useState } from 'react';

const COPYING_ACTIVITY_ID = 5;

const IndustryJobsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<IndustryJobOrderBy>(IndustryJobOrderBy.startDate);

  const { loading, data } = useQuery<GetIndustryJobs, GetIndustryJobsVariables>(getIndustryJobsQuery, {
    variables: {
      page: {
        index: currentPage,
        size: rowsPerPage,
      },
    },
  });

  const tableData = data ? data.industryJobs.jobs : null;

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <DataTable<IndustryJob, IndustryJobOrderBy>
        idField="id"
        columns={[
          { field: 'status', title: 'Status' },
          { field: row => `x${row.runs}`, title: 'Job Runs', align: 'right' },
          { field: row => row.activity.name, title: 'Activity' },
          {
            field: row => (row.product ? row.product.name : 'N/A'),
            title: 'Product',
            icon: {
              imageUrl: row => (row.product ? getItemImageUrl(row.product.id, row.product.name, +row.activity.id === COPYING_ACTIVITY_ID) : null),
            },
          },
          {
            field: row => moment(row.startDate).format('MM/DD/YYYY HH:mm'),
            title: 'Install Date',
          },
          {
            field: row => moment(row.endDate).format('MM/DD/YYYY HH:mm'),
            title: 'End Date',
          },
        ]}
        data={tableData}
        size="small"
        aria-label="industry jobs table"
        pagingOptions={{
          page: currentPage,
          rowCount: data ? data.industryJobs.total : 0,
          rowsPerPage: rowsPerPage,
          onChangePage: (event, newPage) => setCurrentPage(newPage),
          onChangeRowsPerPage: handleChangeRowsPerPage,
        }}
      />
    </React.Fragment>
  );
};

export default IndustryJobsTab;
