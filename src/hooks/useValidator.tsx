import { default as React, useState } from 'react';

interface IRule {
  required?: boolean;
  min?: number;
  max?: number;
}

interface IError {
  message?: string;
}

const useValidator = <T extends {}>(defaults: Partial<T> = {}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, IError>>>({});
  const [values, setValues] = useState<Partial<T>>(defaults);
  const [rules, setRules] = useState<Partial<Record<keyof T, IRule>>>({});

  const register = (name: keyof T, rule: IRule) => {
    setRules(prevRules => {
      return {
        ...prevRules,
        [name]: rule,
      };
    });
  };

  const setError = (name: keyof T, error: IError) => {
    setErrors(prevErrors => {
      return {
        ...prevErrors,
        [name]: error,
      };
    });
  };

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    const rule = rules[name];

    if (rule) {
      if (rule.required && value == null) {
        setError(name, { message: `This field is required` });
      } else if (rule.min != null && +value < rule.min) {
        setError(name, { message: `Must be at least ${rule.min}` });
      } else if (rule.max != null && +value > rule.max) {
        setError(name, { message: `Must not exceed ${rule.max}` });
      } else {
        setErrors(prevErrors => {
          // clear error
          const newErrors = {
            ...prevErrors,
          };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    setValues(prevValues => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleSubmit = (callback: (data: T) => void) => {
    return (e: React.BaseSyntheticEvent<object, any, any>) => {
      e.stopPropagation();
      if (Object.keys(errors).length === 0) {
        callback({ ...values } as T); // TODO: find safer way to do this
      }
    };
  };

  return {
    handleSubmit,
    register,
    errors,
    setValue,
  };
};

export default useValidator;
