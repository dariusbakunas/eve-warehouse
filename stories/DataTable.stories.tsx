import * as React from 'react';
import { DataTable, IDataTableHeader } from '../src/components/DataTable/DataTable';
import { DataTableRow } from 'carbon-components-react';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Data Table',
  component: DataTable,
  decorators: [withKnobs],
};

export const Default = () => {
  interface IRow extends DataTableRow {
    color: string;
    category: string;
    type?: string;
    code: {
      rgba: number[];
      hex: string;
    };
  }
  const sampleData: IRow[] = [
    {
      id: 'black',
      color: 'black',
      category: 'hue',
      type: 'primary',
      code: {
        rgba: [255, 255, 255, 1],
        hex: '#000',
      },
    },
    {
      id: 'white',
      color: 'white',
      category: 'value',
      code: {
        rgba: [0, 0, 0, 1],
        hex: '#FFF',
      },
    },
    {
      id: 'red',
      color: 'red',
      category: 'hue',
      type: 'primary',
      code: {
        rgba: [255, 0, 0, 1],
        hex: '#F00',
      },
    },
    {
      id: 'blue',
      color: 'blue',
      category: 'hue',
      type: 'primary',
      code: {
        rgba: [0, 0, 255, 1],
        hex: '#00F',
      },
    },
    {
      id: 'yellow',
      color: 'yellow',
      category: 'hue',
      type: 'primary',
      code: {
        rgba: [255, 255, 0, 1],
        hex: '#FF0',
      },
    },
    {
      id: 'green',
      color: 'green',
      category: 'hue',
      type: 'secondary',
      code: {
        rgba: [0, 255, 0, 1],
        hex: '#0F0',
      },
    },
  ];

  const columns: IDataTableHeader<keyof IRow>[] = [
    {
      header: 'Color',
      key: 'color',
      customRender: (cell) => <span>{cell.value}</span>,
    },
    {
      header: 'Category',
      key: 'category',
    },
    {
      header: 'Type',
      key: 'type',
    },
  ];

  return (
    <DataTable<IRow, IDataTableHeader<keyof IRow>>
      withSearch={true}
      columns={columns}
      rows={sampleData}
      title="Sample Table"
      description="Table description goes here"
    />
  );
};
