import { default as React, useCallback, useState } from "react";
import { validate as validateEmail } from "email-validator";
import owasp from "owasp-password-strength-test";

interface IRule<T> {
  required?: boolean;
  email?: boolean;
  messages?: {
    email?: string;
    match?: string;
    required?: string;
    min?: string;
    max?: string;
  };
  min?: number;
  max?: number;
  match?: keyof T;
  password?: boolean;
  submitOnly?: boolean;
}

interface IError {
  message?: string;
}

const useValidator = <T extends {}>(defaults: Partial<T> = {}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, IError>>>({});
  const [values, setValues] = useState<Partial<T>>(defaults);
  const [rules, setRules] = useState<Partial<Record<keyof T, IRule<T>>>>({});

  const register = (name: keyof T, rule: IRule<T>) => {
    setRules((prevRules) => {
      return {
        ...prevRules,
        [name]: rule,
      };
    });
  };

  const setError = useCallback((name: keyof T, error: IError) => {
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [name]: error,
      };
    });
  }, []);

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });

    const rule = rules[name];

    if (rule) {
      if (rule.submitOnly) {
        return;
      }

      let errorMessage = null;

      if (rule.match) {
        if (values[rule.match] !== value) {
          if (!errors[rule.match]) {
            const matchRule = rules[rule.match];
            const message = matchRule && matchRule.messages && matchRule.messages["match"] ? matchRule.messages["match"] : "No match";
            setError(rule.match, { message });
          }
          errorMessage = rule.messages && rule.messages["match"] ? rule.messages["match"] : "No match";
        } else {
          // if match rule is validated, remove errors for both matching fields
          setErrors((prevErrors) => {
            // clear error
            const newErrors = {
              ...prevErrors,
            };
            delete newErrors[name];
            delete newErrors[rule.match!];
            return newErrors;
          });
        }
      }

      if (rule.required && value == null) {
        errorMessage = rule.messages && rule.messages["required"] ? rule.messages["required"] : `This field is required`;
      } else if (rule.min != null && +value < rule.min) {
        errorMessage = rule.messages && rule.messages["min"] ? rule.messages["min"] : `Must be at least ${rule.min}`;
      } else if (rule.max != null && +value > rule.max) {
        errorMessage = rule.messages && rule.messages["max"] ? rule.messages["max"] : `Must not exceed ${rule.max}`;
      } else if (rule.password) {
        const { errors } = owasp.test(`${value}`);
        if (errors && errors.length) {
          errorMessage = errors[0];
        }
      } else if (rule.email) {
        const isValid = validateEmail(`${value}`);
        if (!isValid) {
          errorMessage = rule.messages && rule.messages["email"] ? rule.messages["email"] : `Invalid email`;
        }
      }

      if (errorMessage) {
        setError(name, { message: errorMessage });
      } else {
        setErrors((prevErrors) => {
          // clear error
          const newErrors = {
            ...prevErrors,
          };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (callback?: (data: T) => void) => {
    return (e: React.BaseSyntheticEvent<object, any, any>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (Object.keys(errors).length === 0) {
        if (callback) {
          callback({ ...values } as T); // TODO: find safer way to do this
        }
      }
    };
  };

  return {
    handleSubmit,
    register,
    errors,
    setError,
    setValue,
    values,
  };
};

export default useValidator;
