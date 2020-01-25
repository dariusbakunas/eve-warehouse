import { shallow } from 'enzyme';
import { useEffect } from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import React from 'react';
import useValidator from './useValidator';

interface IFormData {
  numProp: Maybe<number>;
}

const TestForm: React.FC<{ onSubmit?: (data: IFormData) => void }> = ({ onSubmit }) => {
  const { register, handleSubmit, errors, setValue, values } = useValidator<IFormData>();

  useEffect(() => {
    register('numProp', { required: true });
  }, []);

  return (
    <div>
      <input id="numInput" type="number" onChange={event => setValue('numProp', event.target.value ? +event.target.value : null)} />
      <span id="error">{errors.numProp ? errors.numProp.message : ''}</span>
      <button onClick={handleSubmit(onSubmit)}>submit</button>
    </div>
  );
};

describe('useValidator', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useEffect');
  });

  it('sets error for empty required field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('#error').text()).toEqual('This field is required');
  });
});
