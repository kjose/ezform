import React from 'react';
import PropTypes from 'prop-types';
import { formToJsonInputs, errorsToJson, setValue } from '../utils/form';
import FormAdapterInterface from '../external/formAdapterInterface';

const dfn = () => {}; // default empty function

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getPropsToDispatch = this.getPropsToDispatch.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.getErrors = this.getErrors.bind(this);
    this.setValues = this.setValues.bind(this);
    this.cleanErrors = this.cleanErrors.bind(this);
    this.getNode = this.getNode.bind(this);
    this.node = React.createRef();
    // Init state
    this.state = {
      errors: [],
      touched: [],
      values: [],
      isSubmitted: false,
    };
    // Init props
    this.updateComponentFromProps(props);
  }
  componentDidMount() {
    this.initErrorsAndTouched();
    this.setValues(this.defaultValues);
  }
  componentWillReceiveProps(nextProps) {
    // method for component update
    this.updateComponentFromProps(nextProps);
    this.initErrorsAndTouched();
    this.setValues(this.defaultValues);
  }
  componentWillUnmount() {
    if (this.props.adapter instanceof FormAdapterInterface) {
      this.props.adapter.disconnect();
    }
  }
  updateComponentFromProps(props) {
    const {
      schema,
      defaultValues = [],
      onSubmit = dfn,
      onError = dfn,
      renderWith,
      adapter,
      ...otherProps
    } = props;
    this.schema = schema;
    this.defaultValues = defaultValues;
    this.onSubmit = onSubmit;
    this.onError = onError;
    this.renderWith = renderWith;
    this.otherProps = otherProps;
    if (adapter instanceof FormAdapterInterface) {
      adapter.connect(this.getPropsToDispatch());
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    this.initErrorsAndTouched();
    this.setState({
      ...this.state,
      isSubmitted: true,
    });
    this.validateForm(e.target).then((data) => {
      if (data) {
        this.onSubmit(data, this.getPropsToDispatch());
      } else {
        this.onError(this.state.errors);
      }
    });
  }
  handleChange(value, element, form) {
    const values = this.state.values;
    const touched = this.state.touched;
    setValue(values, element.name, value);
    setValue(touched, element.name, true);
    this.setState({
      ...this.state,
      touched,
      values,
    });
    this.validateForm(form);
  }
  initErrorsAndTouched() {
    this.setState({
      ...this.state,
      errors: [],
      touched: [],
      isSubmitted: false,
    });
  }
  validateForm(form) {
    return new Promise((resolve) => {
      if (this.schema) {
        this.schema
          .validate(formToJsonInputs(form), { abortEarly: false })
          .then((values) => {
            this.setErrors([]);
            resolve(values);
          })
          .catch((err) => {
            const newErrors = errorsToJson(err.inner);
            newErrors._has = true;
            newErrors._hasRequiredFields = false;
            Array.from(err.inner).map((e) => {
              if (e.type === 'required') {
                newErrors._hasRequiredFields = true;
              }
            });
            this.setErrors(newErrors);
            resolve(false);
          });
      } else {
        resolve();
      }
    });
  }
  getChildContext() {
    return {
      form: {
        getNode: this.getNode,
        handleChange: this.handleChange,
      },
    };
  }
  getPropsToDispatch() {
    return {
      errors: this.state.errors,
      touched: this.state.touched,
      values: this.state.values,
      isSubmitted: this.state.isSubmitted,
      cleanErrors: this.cleanErrors,
      setErrors: this.setErrors,
      getErrors: this.getErrors,
      setValues: this.setValues,
      ...this.otherProps,
    };
  }
  cleanErrors() {
    this.initErrorsAndTouched();
  }
  getErrors() {
    return this.state.errors;
  }
  setErrors(errors) {
    this.setState({
      ...this.state,
      errors,
    });
  }
  setValues(values) {
    this.setState({
      ...this.state,
      values,
    });
  }
  getNode() {
    return this.node.current;
  }
  render() {
    let children;
    let props = this.otherProps;
    if (this.renderWith) {
      const component = new this.renderWith(this.getPropsToDispatch());
      children = component.props.children;
      props = {
        ...this.otherProps,
        ...component.props,
      };
    } else {
      children = this.props.children;
    }
    return (
      <form
        {...props}
        ref={this.node}
        onSubmit={(e) => {
          this.handleSubmit(e, this.getPropsToDispatch());
        }}
      >
        {children}
      </form>
    );
  }
}

Form.childContextTypes = {
  form: PropTypes.object,
};

export default Form;
