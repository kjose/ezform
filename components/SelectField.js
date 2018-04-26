import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class SelectField extends React.Component {
  render() {
    const { value, changeValue, ...args } = this.props;
    return (
      <Select
        value={value}
        clearable={false}
        onChange={(selectedOption) => {
          const inputHidden = this.context.form.getNode().querySelector(`input[name="${this.props.name}"]`);
          if (inputHidden) {
            if (Array.isArray(selectedOption)) {
              const values = selectedOption.map(option => option.value);
              changeValue(values, inputHidden);
            } else {
              changeValue(selectedOption.value, inputHidden);
            }
          } else {
            console.error('No DOM element with name "', this.props.name, '" exist.');
          }
        }}
        {...args}
      />
    );
  }
}

SelectField.contextTypes = {
  form: PropTypes.object,
};

export default SelectField;
