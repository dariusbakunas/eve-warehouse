import { shallow } from 'enzyme';
import { useEffect } from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import React from 'react';
import useValidator from './useValidator';

interface IFormData {
  numProp: Maybe<number>;
  emailProp: Maybe<string>;
  passwordProp: Maybe<string>;
}

const TestForm: React.FC<{ onSubmit?: (data: IFormData) => void }> = ({ onSubmit }) => {
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

describe('useValidator', () => {
  it('validates required field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#numInput').simulate('change', { target: { value: '' } });
    expect(wrapper.find('#numError').text()).toEqual('This field is required');
  });

  it('validates min field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#numInput').simulate('change', { target: { value: 4 } });
    expect(wrapper.find('#numError').text()).toEqual('Must be at least 5');
  });

  it('validates max field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#numInput').simulate('change', { target: { value: 12 } });
    expect(wrapper.find('#numError').text()).toEqual('Must not exceed 10');
  });

  it('validates email field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#emailInput').simulate('change', { target: { value: 'test' } });
    expect(wrapper.find('#emailError').text()).toEqual('Invalid email');
  });

  it('validates password field', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#passwordInput').simulate('change', { target: { value: 'simpleP@ssword' } });
    expect(wrapper.find('#passwordError').text()).toEqual('The password must contain at least one number.');
  });

  it('resets error once validation passes', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    const submitMock = jest.fn();
    useEffectSpy.mockImplementationOnce(f => f());
    useEffectSpy.mockImplementationOnce(f => f());
    const wrapper = shallow(<TestForm onSubmit={submitMock} />);
    wrapper.find('#numInput').simulate('change', { target: { value: 4 } });
    expect(wrapper.find('#numError').text()).toEqual('Must be at least 5');
    wrapper.find('#numInput').simulate('change', { target: { value: 6 } });
    expect(wrapper.find('#numError').text()).toEqual('');
  });
});
