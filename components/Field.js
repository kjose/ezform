import React from 'react';
import PropTypes from 'prop-types';
import TextField from './TextField';
import SubmitField from './SubmitField';
import SelectField from './SelectField';

let counter = 0;

class Field extends React.Component {
  state = {
    value: this.props.value || '',
  };
  changeValue = (value, element) => {
    this.setState({
      ...this.state,
      value,
    });
    this.context.form.handleChange(value, element, element.form);
  };
  render() {
    const { type, ...args } = this.props;
    let jsx = '';
    switch (type) {
      case 'text':
        jsx = (
          <TextField
            value={this.state.value}
            changeValue={this.changeValue}
            {...args}
          />
        );
        break;
      case 'select':
        jsx = (
          <SelectField
            id={`form-field-${counter++}`}
            value={this.state.value}
            noResultsText="Pas de résultat"
            changeValue={this.changeValue}
            {...args}
          />
        );
        break;
      case 'submit':
        jsx = <SubmitField {...args} />;
        break;
      default:
        jsx = (
          <input
            type={type}
            value={this.state.value}
            onChange={e => {
              this.changeValue(e.target.value, e.target);
            }}
            {...args}
          />
        );
        break;
    }
    return jsx;
  }
}

Field.contextTypes = {
  form: PropTypes.object,
};

export default Field;
