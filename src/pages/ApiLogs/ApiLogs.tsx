import { GetCharacterNames_characters as Character, GetCharacterNames } from '../../__generated__/GetCharacterNames';
import { Checkbox, DataTableRow, Loading } from 'carbon-components-react';
import { DataTable } from '../../components/DataTable/DataTable';
import { GetProcessingLogs, GetProcessingLogsVariables } from '../../__generated__/GetProcessingLogs';
import { loader } from 'graphql.macro';
import { OverflowMultiselect } from '../../components/OverflowMultiselect/OverflowMultiselect';
import { SettingsAdjust32 } from '@carbon/icons-react';
import { useNotification } from '../../components/Notifications/useNotifications';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';

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
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const { loading: characterNamesLoading, data: characterResponse } = useQuery<GetCharacterNames>(getCharacterNamesQuery);
  const { data, loading: logsLoading } = useQuery<GetProcessingLogs, GetProcessingLogsVariables>(getProcessingLogsQuery, {
    variables: {
      filter: {
        characterIds: selectedCharacters,
      },
    },
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

  const handleCharacterFilterChange = useCallback(({ selectedItems }: { selectedItems: Character[] }) => {
    setSelectedCharacters(selectedItems.map((character) => character.id));
  }, []);

  const loading = characterNamesLoading || logsLoading;

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
        renderIcon={SettingsAdjust32}
      />
    </React.Fragment>
  );

  return (
    <div className="page-container api-logs">
      <h2>API Logs</h2>
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <DataTable<ILogRow>
        columns={[
          { header: 'Date', key: 'date' },
          { header: 'Character', key: 'character' },
          { header: 'Category', key: 'category' },
          {
            header: 'Status',
            key: 'success',
            customRender: (cell) => <Checkbox id={'check-' + cell.id} checked={cell.success} labelText="" readOnly={true} />,
          },
          { header: 'Message', key: 'message' },
        ]}
        rows={tableData}
        toolbarItems={toolbarItems}
        withSearch={true}
        totalRows={tableData.length}
      />
    </div>
  );
};
