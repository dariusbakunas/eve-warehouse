import { shallow, ShallowWrapper } from 'enzyme';
import { useEffect } from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import React from 'react';
import useValidator from './useValidator';

interface IFormData {
  numProp: Maybe<number>;
  emailProp: Maybe<string>;
  passwordProp: Maybe<string>;
}

interface ITestFormProps {
  onSubmit?: (data: IFormData) => void;
}

const TestForm: React.FC<ITestFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, errors, setValue, values } = useValidator<IFormData>();

  useEffect(() => {
    register('numProp', { required: true, min: 5, max: 10 });
    register('emailProp', { email: true });
    register('passwordProp', { password: true });
  }, []);

  return (
    <div>
      <input id="numInput" type="number" onChange={event => setValue('numProp', event.target.value ? +event.target.value : null)} />
      <input id="emailInput" onChange={event => setValue('emailProp', event.target.value ? event.target.value : null)} />
      <input id="passwordInput" onChange={event => setValue('passwordProp', event.target.value ? event.target.value : null)} />
      <span id="numError">{errors.numProp ? errors.numProp.message : ''}</span>
      <span id="emailError">{errors.emailProp ? errors.emailProp.message : ''}</span>
      <span id="passwordError">{errors.passwordProp ? errors.passwordProp.message : ''}</span>
      <button onClick={handleSubmit(onSubmit)}>submit</button>
    </div>
  );
};

let useEffectSpy: jest.SpyInstance;
let wrapper: ShallowWrapper<ITestFormProps, {}, React.Component>;

describe('useValidator', () => {
  beforeEach(() => {
    const submitMock = jest.fn();
    useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce(f => f());
    wrapper = shallow(<TestForm onSubmit={submitMock} />);
  });

  it('validates required field', () => {
    wrapper.find('#numInput').simulate('change', { target: { value: '' } });
    expect(wrapper.find('#numError').text()).toEqual('This field is required');
  });

  it('validates min field', () => {
    wrapper.find('#numInput').simulate('change', { target: { value: 4 } });
    expect(wrapper.find('#numError').text()).toEqual('Must be at least 5');
  });

  it('validates max field', () => {
    wrapper.find('#numInput').simulate('change', { target: { value: 12 } });
    expect(wrapper.find('#numError').text()).toEqual('Must not exceed 10');
  });

  it('validates email field', () => {
    wrapper.find('#emailInput').simulate('change', { target: { value: 'test' } });
    expect(wrapper.find('#emailError').text()).toEqual('Invalid email');
  });

  it('validates password field', () => {
    wrapper.find('#passwordInput').simulate('change', { target: { value: 'simpleP@ssword' } });
    expect(wrapper.find('#passwordError').text()).toEqual('The password must contain at least one number.');
  });

  it('resets error once validation passes', () => {
    wrapper.find('#numInput').simulate('change', { target: { value: 4 } });
    expect(wrapper.find('#numError').text()).toEqual('Must be at least 5');
    wrapper.find('#numInput').simulate('change', { target: { value: 6 } });
    expect(wrapper.find('#numError').text()).toEqual('');
  });
});
