import { useContext, useState } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { truncate } from '../utils/truncate';

import { Context } from '../context/context';

import { chainList } from '../config';

import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Button,
} from '@mui/material';

const drawerWidth = 240;

const links = [
  { id: 1, path: '/', title: 'Home' },
  { id: 2, path: '/subscribe', title: 'Subscription' },
  { id: 3, path: '/tutorial', title: 'Tutorial' },
];

const Navbar = () => {
  // const classes = navbarStyles();

  const {
    defaultAccount,
    chain,
    chainId,
    loading,
    connectWalletHandler,
    changeChain,
  } = useContext(Context);

  const connect = () => {
    if (defaultAccount) return;
    connectWalletHandler();
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className='drawer'>
      <div>
        <Image src='/logo.png' height='50' width='50' alt='' />
      </div>
      <Divider />
      <List>
        {links.map((link) => (
          <ListItem key={link.id} disablePadding>
            <ListItemButton className='link-container'>
              <Link href={link.path} className='link'>
                <ListItemText primary={link.title} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component='nav'>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <div
            sx={{
              flexGrow: 1,
              display: { sm: 'none', md: 'block' },
            }}
          >
            <Image src='/logo.png' height='60' width='60' alt='' />
          </div>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <div className='link-container'>
              {links.map((link) => (
                <Link key={link.id} href={link.path}>
                  <a className='navbar-link'>{link.title}</a>
                </Link>
              ))}
            </div>
          </Box>
          <div className='navbar-right'>
            {chain && (
              <div className='dropdown'>
                <Button
                  className='nav-button'
                  size='small'
                  variant='contained'
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    mr: { xs: 0, sm: 2 },
                    backgroundColor: '#3D3D90',
                    '&:hover': {
                      backgroundColor: '#191970',
                    },
                  }}
                >
                  {chain}
                </Button>
                <div className='dropdown-content'>
                  {chainList
                    .filter((selection) => selection.name !== chain)
                    .map((chain) => (
                      <div
                        className='chain-container'
                        key={chain.id}
                        onClick={() => changeChain(chainId, chain.id)}
                      >
                        <div className='chain'>{chain.name.toUpperCase()}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <Button
              className='nav-button'
              size='small'
              onClick={connect}
              color='info'
              variant='contained'
              disabled={loading}
            >
              {defaultAccount ? truncate(defaultAccount) : 'Connect Wallet'}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Box component='nav'>
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
