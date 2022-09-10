import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';

// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Button, CircularProgress } from '@mui/material';

const Dropdown = ({
  array,
  current,
  select,
  loading = false,
  btnWidth = 128,
}) => {
  const [visible, setVisible] = useState(false);

  function useOutsideClick(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setVisible(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  return (
    current && (
      <div className='dropdown' ref={wrapperRef}>
        <Button
          className='button-dropdown'
          color='primary'
          size='small'
          variant='contained'
          // endIcon={!visible ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          disabled={loading}
          startIcon={
            !loading ? (
              <Image src={current.icon} height={20} width={20} />
            ) : null
          }
          style={{ width: btnWidth }}
          onClick={() => setVisible(!visible)}
        >
          {!loading ? (
            current.name
          ) : (
            <CircularProgress size={25} color='secondary' />
          )}
        </Button>
        <div
          className={`dropdown-content ${
            visible && 'dropdown-content-visible'
          }`}
          style={{ width: btnWidth }}
        >
          {array
            .filter((selection) => selection.name !== current.name)
            .map((option) => (
              <div
                className='selection-container'
                key={option.id}
                onClick={() => {
                  select(option.id);
                  setVisible(false);
                }}
              >
                <div className='selection'>
                  <div>
                    <Image src={option.icon} height={20} width={20} />
                  </div>
                  <div>{option.name.toUpperCase()}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  );
};

export default Dropdown;
