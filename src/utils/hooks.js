import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [value, setValue] = useState(initialState);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    handleChange,
    handleSubmit,
    value,
  };
};
