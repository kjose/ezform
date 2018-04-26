# Ezform module

## Getting started

````
# inner form
const InnerForm = ({
    errors,
    ...remainingDispatcher
} => (
    <div class="myform"> // div will be replaced by <form>
        <div class="field">
            {errors.name && <p>Name is invalid</p>}
            <input type="text" name="name" />
        </div>
    </div>
));
````

````
# init schema with Yup.js (https://github.com/jquense/yup)
# and ... in render
<div className="rui panel spacing">
    {withForm({
      schema: schema,
      onSubmit: this.handleSubmit,
    })(InnerForm)}
</div>
````

## Component Fields

For managing live reload of the Form, you have to use Component fields.

Available fields are :
 
`<Field type="text" name="name"/>`

`<Field type="submit" name="name"/>`

## Methods

Methods dispatched are method which are sent to the methods of the withForm component :
- onSubmit
- onChange
- onError

These dispatcher is : 
- setErrors : method to set errors
- cleanErrors : method to clean errors
- errors : object of errors
- touched : object of touched fields