import { ApplicationContext } from '../context/ApplicationContext';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

function useApplicationState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const { state, dispatch } = useContext(ApplicationContext);

  const storedValue = (): T => {
    const json = state[key];

    if (json) {
      return JSON.parse(json);
    } else {
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T>(storedValue);

  useEffect(() => {
    dispatch({ type: 'setValue', key, value: JSON.stringify(value) });
  }, [value]);

  return [value, setValue];
}

export { useApplicationState };
