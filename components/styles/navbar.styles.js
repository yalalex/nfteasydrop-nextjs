import { makeStyles } from '@mui/styles';

export const navbarStyles = makeStyles({
  linkContainer: {
    display: 'flex',
    paddingLeft: 15,
  },
  navbarRight: {
    marginLeft: 10,
    width: '100%',
    display: 'flex',
    minWidth: 300,
    justifyContent: 'flex-end',
  },
  navBarLink: {
    padding: 10,
    textDecoration: 'none',
    color: '#fff',
  },
  navButton: {
    width: 150,
  },
  dropdown: {
    position: 'relative',
    display: 'inline-block',
    '&:hover div:nth-child(2)': {
      visibility: 'visible',
      opacity: 1,
      transitionDelay: '0s, 0s',
    },
  },
  dropdownContent: {
    visibility: 'hidden',
    opacity: 0,
    transitionProperty: 'opacity, visibility',
    transitionDuration: '.4s, 0s',
    transitionDelay: '0s, .4s',
    position: 'absolute',
    backgroundColor: '#3D3D90',
    boxSizing: 'border-box',
    borderRadius: 3,
    fontSize: 14,
    width: 150,
    boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.2)',
    zIndex: 5,
  },
  chainContainer: {
    display: 'block',
    paddingTop: 5,
    paddingBottom: 5,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#191970',
    },
    '&:hover:first-child': {
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
    },
    '&:hover:last-child': {
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
    },
  },
  chain: {
    marginLeft: 30,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
