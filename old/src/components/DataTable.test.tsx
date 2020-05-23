import { render } from 'enzyme';
import DataTable from './DataTable';
import React from 'react';

describe('DataTable', () => {
  it('renders without errors', () => {
    interface Entry {
      id: number;
      prop1: string;
      nested: {
        prop2: string;
      };
    }

    const tableData = [
      { id: 1, prop1: 'test prop 1a', nested: { prop2: 'test prop 2a' } },
      { id: 2, prop1: 'test prop 1b', nested: { prop2: 'test prop 2b' } },
      { id: 3, prop1: 'test prop 1c', nested: { prop2: 'test prop 2c' } },
    ];

    const wrapper = render(
      <DataTable<Entry, {}>
        idField="id"
        columns={[
          { field: 'prop1', title: 'Prop 1' },
          { field: row => row.nested.prop2, title: 'Prop 2' },
        ]}
        data={tableData}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
