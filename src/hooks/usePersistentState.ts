import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const storedValue = (): T => {
    const json = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;

    if (json) {
      return JSON.parse(json);
    } else {
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T>(storedValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value]);

  return [value, setValue];
}

export { usePersistentState };
