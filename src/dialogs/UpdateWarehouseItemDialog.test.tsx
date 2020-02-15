import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import UpdateWarehouseItemDialog from './UpdateWarehouseItemDialog';

describe('UpdateWarehouseItemDialog', () => {
  it('submits changed values', () => {
    const submit = jest.fn();

    const wrapper = shallow(<UpdateWarehouseItemDialog itemName="test item" quantity={100} unitCost={5.6} open={false} onSubmit={submit} />);
    wrapper.setProps({ open: true });
    wrapper
      .find(TextField)
      .first()
      .simulate('change', { target: { value: '123456' } });

    wrapper
      .find(TextField)
      .last()
      .simulate('change', { target: { value: '321.56' } });

    wrapper.find(Button).simulate('click');
    expect(submit).toHaveBeenCalledWith({
      qty: 123456,
      unitCost: 321.56
    });
  });
});
