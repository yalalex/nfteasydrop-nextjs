import { useContext, useState } from 'react';

import Dropdown from './Dropdown';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { truncate } from '../utils/truncate';

import { Context } from '../context/context';

import { chainList, langList } from '../config';

import MenuIcon from '@mui/icons-material/Menu';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

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
  { id: 2, path: '/subscribe', title: 'Subscribe' },
  { id: 3, path: '/tutorial', title: 'Tutorial' },
];

const Navbar = () => {
  const router = useRouter();

  const {
    defaultAccount,
    chain,
    chainId,
    lang,
    loading,
    connectWalletHandler,
    changeChain,
    changeLang,
  } = useContext(Context);

  const switchChain = (newChainId) => {
    changeChain(chainId, newChainId);
  };

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
                <ListItemText
                  primary={link.title}
                  style={{
                    textDecoration:
                      router.pathname === link.path && 'underline',
                  }}
                />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <div className='drawer-icons'>
            <Link href='https://twitter.com/nfteasydrop'>
              <a target='_blank'>
                <IconButton
                  size='large'
                  color='inherit'
                  aria-label='visit twitter'
                >
                  <TwitterIcon />
                </IconButton>
              </a>
            </Link>
            <Link href=''>
              <a target='_blank'>
                <IconButton
                  size='large'
                  color='inherit'
                  aria-label='open telegram'
                >
                  <TelegramIcon />
                </IconButton>
              </a>
            </Link>
          </div>
        </ListItem>
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
                  <a
                    className='navbar-link'
                    style={{
                      color: router.pathname === link.path && '#fff',
                    }}
                  >
                    {link.title}
                  </a>
                </Link>
              ))}
              <Link href='https://twitter.com/nfteasydrop'>
                <a target='_blank'>
                  <IconButton color='inherit' aria-label='visit twitter'>
                    <TwitterIcon />
                  </IconButton>
                </a>
              </Link>
              <Link href=''>
                <a target='_blank'>
                  <IconButton color='inherit' aria-label='open telegram'>
                    <TelegramIcon />
                  </IconButton>
                </a>
              </Link>
            </div>
          </Box>
          <div className='navbar-right'>
            {chain && (
              <div style={{ paddingRight: 10 }}>
                <Dropdown
                  array={chainList}
                  current={chain}
                  select={switchChain}
                />
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
              {defaultAccount ? truncate(defaultAccount) : 'Connect'}
            </Button>
            <div style={{ paddingLeft: 10 }}>
              <Dropdown
                array={langList}
                current={lang}
                select={changeLang}
                btnWidth={64}
              />
            </div>
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