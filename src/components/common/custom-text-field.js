import React from 'react';
import TextField from 'material-ui/TextField';
import { white, pink } from '../../config/colors';

const CustomTextField = ({
  type, value, style, floatingLabelText, onChange, id
}) => {
  return (
    <TextField
      id={id}
      floatingLabelText={floatingLabelText}
      floatingLabelStyle={{ color: white }}
      floatingLabelFocusStyle={{ color: pink }}
      underlineFocusStyle={{ borderColor: pink }}
      type={type}
      value={value}
      style={style}
      onChange={onChange}
    />
  );
};

export default CustomTextField;
