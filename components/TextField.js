import React from 'react';

const TextField = ({ value, changeValue, ...args }) => (
  <input
    type="text"
    value={value || ''}
    onChange={(e) => {
        e.stopPropagation();
        changeValue(e.target.value, e.target);
      }}
    autoComplete="name"
    {...args}
  />
);

export default TextField;
