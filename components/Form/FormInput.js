import { TextField } from '@mui/material';

const FormInput = ({ label, value, fn }) => {
  return (
    <div className='form-element'>
      <TextField
        color='success'
        label={label}
        value={value}
        onChange={fn}
        type='text'
        variant='outlined'
        autoComplete='do-not-autofill'
        fullWidth
      />
    </div>
  );
};

export default FormInput;
