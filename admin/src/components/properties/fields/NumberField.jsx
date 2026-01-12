
import React from 'react';
import TextField from './TextField';

const NumberField = ({ label, name, value, onChange, placeholder = '0', required = false }) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type="number"
    required={required}
  />
);

export default NumberField;
