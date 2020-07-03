import { Checkbox, DataTableRow, Loading } from 'carbon-components-react';
import { DataTable, IDataTableHeader } from '../../components/DataTable/DataTable';
import { GetCharacterNames } from '../../__generated__/GetCharacterNames';
import { GetProcessingLogs, GetProcessingLogsVariables } from '../../__generated__/GetProcessingLogs';
import { loader } from 'graphql.macro';
import { useNotification } from '../../components/Notifications/useNotifications';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useMemo } from 'react';

const getCharacterNamesQuery = loader('../../queries/getCharacterNames.graphql');
const getProcessingLogsQuery = loader('../../queries/getProcessingLogs.graphql');

interface ILogRow extends DataTableRow {
  category: string;
  character: string | null;
  date: string;
  success: boolean;
  message: string;
}

export const ApiLogs: React.FC = () => {
  const { enqueueNotification } = useNotification();
  const { loading: characterNamesLoading } = useQuery<GetCharacterNames>(getCharacterNamesQuery);
  const { data, loading: logsLoading } = useQuery<GetProcessingLogs, GetProcessingLogsVariables>(getProcessingLogsQuery, {
    // variables: {
    //   filter: {
    //     characterId: characterFilter ? characterFilter.id : null,
    //   },
    // },
    onError: (error) => {
      enqueueNotification(`Logs failed to load: ${error.message}`, null, { kind: 'error' });
    },
  });

  const tableData: ILogRow[] = useMemo(() => {
    if (!data || !data.processingLogs) {
      return [];
    }

    return data.processingLogs.map((entry) => {
      return {
        id: entry.id,
        character: entry.character ? entry.character.name : null,
        category: entry.category,
        date: moment(entry.createdAt).format('MM/DD/YYYY HH:mm'),
        success: entry.status === 'SUCCESS',
        message: entry.message,
      };
    });
  }, [data]);

  const loading = characterNamesLoading || logsLoading;

  return (
    <div className="page-container api-logs">
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <DataTable<ILogRow, IDataTableHeader<keyof ILogRow>>
        title="API Logs"
        columns={[
          { header: 'Date', key: 'date' },
          { header: 'Character', key: 'character' },
          { header: 'Category', key: 'category' },
          {
            header: 'Status',
            key: 'success',
            customRender: (cell) => <Checkbox id={'check-' + cell.id} checked={cell.value} labelText="" readOnly={true} />,
          },
          { header: 'Message', key: 'message' },
        ]}
        rows={tableData}
        withSearch={true}
      />
    </div>
  );
};
