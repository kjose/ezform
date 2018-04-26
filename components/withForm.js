import React from 'react';
import Form from './Form';
import hoistStatics from 'hoist-non-react-statics';

const withForm = injectedProps => Component => <Form {...injectedProps} renderWith={Component} />;

export default withForm;
