import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button } from '@mui/material';

const Dropdown = ({ array, current, select, btnWidth = 128 }) => {
  return (
    <div className='dropdown'>
      <Button
        className='button-dropdown'
        size='small'
        variant='contained'
        endIcon={<ArrowDropDownIcon />}
        style={{ width: btnWidth }}
      >
        {current}
      </Button>
      <div className='dropdown-content' style={{ width: btnWidth }}>
        {array
          .filter((selection) => selection.name !== current)
          .map((option) => (
            <div
              className='selection-container'
              key={option.id}
              onClick={() => select(option.id)}
            >
              <div className='selection'>{option.name.toUpperCase()}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dropdown;
