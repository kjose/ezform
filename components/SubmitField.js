import React from 'react';

const SubmitField = ({ value, ...args }) => (
  <button type="submit" {...args}>
    {value || args.children}
  </button>
);

export default SubmitField;
