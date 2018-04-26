/**
 * Used to return form data into json
 * @param elements
 * @returns {{}}
 */
export const formToJsonInputs = (form) => {
  const data = {};
  Array.from(form.elements).map((element) => {
    if (element.name) {
      switch (element.tagName) {
        case 'INPUT':
          setValue(data, element.name, element.value);
          break;
      }
    }
  });
  return data;
};

export const errorsToJson = (errors) => {
  const data = {};
  Array.from(errors).map((error) => {
    setValue(data, error.path, {
      message: error.message,
      type: error.type,
    });
  });
  return data;
};

export const setValue = (object, path, value) => {
  path = path.replace(/\[([a-zA-Z]|([\w\d]+[\w\d]+?))\]/g, '.$1', path);
  const splitted = path.split('.');
  setValueArray(object, splitted, value);
};
const setValueArray = (object, pathArray, value) => {
  if (pathArray.length > 1) {
    const firstItem = pathArray.shift();
    const matchArray = firstItem.match(/^(.+)\[(\d+)\]$/);
    if (matchArray) {
      const key = matchArray[1];
      const index = matchArray[2];
      object[key] = object[key] || [];
      object[key][index] = object[key][index] || {};
      setValueArray(object[key][index], pathArray, value);
    } else {
      object[firstItem] = object[firstItem] || {};
      setValueArray(object[firstItem], pathArray, value);
    }
  } else {
    const matchArray = pathArray[0].match(/^(.+)\[\]$/);
    if (matchArray) {
      const key = matchArray[1];
      object[key] = object[key] || [];
      object[key].push(value);
    } else {
      object[pathArray[0]] = value;
    }
  }
};
