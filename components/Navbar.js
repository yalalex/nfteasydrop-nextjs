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
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

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
    // lang,
    // loading,
    connectWalletHandler,
    changeChain,
    // changeLang,
  } = useContext(Context);

  const switchChain = (newChainId) => {
    changeChain(newChainId);
  };

  // const switchLang = (newLangId) => {
  //   changeLang(newLangId);
  // };

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
        <ZoomOutMapIcon
          color='primary'
          aria-label='visit etherscan'
          style={{ marginTop: 5, height: 40, width: 40 }}
        />
      </div>
      <Divider />
      <List sx={{ marginTop: -1 }}>
        {links.map((link) => (
          <ListItem key={link.id} disablePadding>
            <ListItemButton
              className='link-container'
              sx={{
                background:
                  router.pathname === link.path
                    ? 'rgb(255,255,255,0.05)'
                    : 'normal',
              }}
            >
              <Link href={link.path} className='link'>
                <ListItemText primary={link.title} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <div className='drawer-icons'>
            <a
              href='https://etherscan.io/address/0x705bbe23ed7bdf8acc4e87012fcbdd2be76900f6'
              target='_blank'
            >
              <IconButton
                size='large'
                color='secondary'
                aria-label='visit etherscan'
              >
                <Image src='/ether.svg' height='24' width='24' />
              </IconButton>
            </a>
            <a href='https://twitter.com/nfteasydrop' target='_blank'>
              <IconButton
                size='large'
                color='secondary'
                aria-label='visit twitter'
              >
                <TwitterIcon />
              </IconButton>
            </a>
            <a href='' target='_blank'>
              <IconButton
                size='large'
                color='secondary'
                aria-label='open telegram'
              >
                <TelegramIcon />
              </IconButton>
            </a>
          </div>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        component='nav'
        style={{
          background: 'linear-gradient(89deg, #ff5edf 0%, #04c8de 100%)',
          // opacity: 0.9,
        }}
      >
        <Toolbar>
          <IconButton
            color='secondary'
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
            <Link href={links[0].path}>
              <a>
                <ZoomOutMapIcon
                  color='primary'
                  aria-label='visit etherscan'
                  style={{ marginTop: 5, height: 50, width: 50 }}
                />
              </a>
            </Link>
          </div>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <div className='links-container'>
              {links.map((link) => (
                <Link key={link.id} href={link.path}>
                  <Box
                    className='link-container'
                    sx={{
                      background:
                        router.pathname === link.path
                          ? 'rgb(0,0,0,0.05)'
                          : 'normal',
                    }}
                  >
                    <a className='link'>{link.title}</a>
                  </Box>
                </Link>
              ))}
              <ListItem disablePadding>
                <a
                  href='https://etherscan.io/address/0x705bbe23ed7bdf8acc4e87012fcbdd2be76900f6'
                  target='_blank'
                  className='icon-container'
                >
                  <IconButton
                    color='secondary'
                    size='large'
                    aria-label='visit etherscan'
                    style={{ height: 48, width: 48 }}
                  >
                    <Image src='/ether.svg' width='100%' height='100%' />
                  </IconButton>
                </a>
              </ListItem>
              <ListItem disablePadding>
                <a
                  href='https://twitter.com/nfteasydrop'
                  target='_blank'
                  className='icon-container'
                >
                  <IconButton
                    color='secondary'
                    size='large'
                    aria-label='visit twitter'
                  >
                    <TwitterIcon />
                  </IconButton>
                </a>
              </ListItem>
              <ListItem disablePadding>
                <a href='' target='_blank' className='icon-container'>
                  <IconButton
                    color='secondary'
                    size='large'
                    aria-label='open telegram'
                  >
                    <TelegramIcon />
                  </IconButton>
                </a>
              </ListItem>
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
              color='secondary'
              variant='outlined'
              // disabled={loading}
            >
              {defaultAccount ? truncate(defaultAccount) : 'Connect'}
            </Button>
            {/* {lang && (
              <div style={{ paddingLeft: 10 }}>
                <Dropdown
                  array={langList}
                  current={lang}
                  select={switchLang}
                  btnWidth={64}
                />
              </div>
            )} */}
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
