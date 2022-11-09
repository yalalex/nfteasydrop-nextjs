import { useState } from 'react';

import { useSelector } from 'react-redux';
import { connectWalletHandler, changeChain, setAlert } from '../redux/funcs';

import Dropdown from './Dropdown';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { truncate } from '../utils/truncate';

import { airdropContractAddress, chainList, langList } from '../config';

import MenuIcon from '@mui/icons-material/Menu';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

import logo from '../public/logos/logo.png';

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
  CircularProgress,
} from '@mui/material';

const drawerWidth = 240;

const links = [
  // { id: 1, path: '/', title: 'Home' },
  { id: 2, path: '/vip-pass', title: 'VIP Pass' },
  { id: 3, path: '/tutorial', title: 'Tutorial' },
  { id: 4, path: '/faq', title: 'FAQ' },
  { id: 5, path: '/erc-20', title: 'ERC-20' },
];

const Navbar = () => {
  const router = useRouter();

  const { defaultAccount, chain, loading } = useSelector(
    (state) => state.wallet
  );

  const switchChain = (newChainId) => {
    if (!defaultAccount) return setAlert('Please connect your wallet first');
    changeChain(newChainId);
  };

  // const switchLang = (newLangId) => {
  //   dispatch(changeLang(newLangId));
  // };

  const connect = () => {
    if (defaultAccount) return;
    if (window.ethereum && window.ethereum.isMetaMask) connectWalletHandler();
    else setAlert('Please install MetaMask browser extension to interact');
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className='drawer'>
      <Link href='/'>
        <IconButton size='large' color='primary' aria-label='NFT Easy Drop'>
          <Image src={logo} height={45} width={109} alt='' />
        </IconButton>
      </Link>
      <Divider />
      <List sx={{ marginTop: -1 }}>
        {links.map((link) => (
          <ListItem key={link.id} disablePadding>
            <ListItemButton
              className='link-container'
              sx={{
                background:
                  router.pathname === link.path && 'rgba(255, 255, 255, 0.05)',
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
              href={`https://etherscan.io/address/${airdropContractAddress}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <IconButton
                size='large'
                color='secondary'
                aria-label='visit etherscan'
              >
                <Image src='/icons/ether.svg' height='24' width='24' alt='' />
              </IconButton>
            </a>
            <a
              href='https://twitter.com/nfteasydrop'
              target='_blank'
              rel='noopener noreferrer'
            >
              <IconButton
                size='large'
                color='secondary'
                aria-label='visit twitter'
              >
                <TwitterIcon />
              </IconButton>
            </a>
            <a
              href='https://t.me/nfteasydrop'
              target='_blank'
              rel='noopener noreferrer'
            >
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
      <AppBar component='nav' className='navbar'>
        <Toolbar>
          <IconButton
            color='secondary'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link href='/'>
            <IconButton
              color='secondary'
              // edge='start'
              size='medium'
              aria-label='NFT Easy Drop'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className='logo'
            >
              <Image
                src={logo}
                priority={true}
                height={45}
                width={109}
                alt=''
              />
            </IconButton>
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <div className='links-container'>
              {links.map((link) => (
                <Link key={link.id} href={link.path}>
                  <Box
                    className='link-container'
                    sx={{
                      background:
                        router.pathname === link.path && 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <a className='link'>{link.title}</a>
                  </Box>
                </Link>
              ))}
            </div>
          </Box>
          <Box className='navbar-right'>
            <div className='links-container'>
              <List sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                <ListItem disablePadding>
                  <a
                    href={`https://etherscan.io/address/${airdropContractAddress}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='icon-container'
                  >
                    <IconButton
                      color='secondary'
                      size='large'
                      aria-label='visit etherscan'
                      className='icon-button'
                    >
                      <Image
                        src='/icons/ether.svg'
                        priority={true}
                        width='100%'
                        height='100%'
                        alt=''
                      />
                    </IconButton>
                  </a>
                </ListItem>
                <ListItem disablePadding>
                  <a
                    href='https://twitter.com/nfteasydrop'
                    target='_blank'
                    rel='noopener noreferrer'
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
                  <a
                    href='https://t.me/nfteasydrop'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='icon-container'
                  >
                    <IconButton
                      color='secondary'
                      size='large'
                      aria-label='open telegram'
                    >
                      <TelegramIcon />
                    </IconButton>
                  </a>
                </ListItem>
              </List>
              {chain && (
                <Box className='first-button' sx={{ mt: { sm: 0.3, md: 2 } }}>
                  <Dropdown
                    array={chainList}
                    current={chain}
                    select={switchChain}
                    loading={loading === 'chain'}
                  />
                </Box>
              )}
              <Button
                className='connect-button'
                size='small'
                onClick={connect}
                color='secondary'
                variant='outlined'
                disabled={loading === 'account'}
                sx={{ mt: { sm: 0.3, md: 2 } }}
              >
                {!defaultAccount ? (
                  loading === 'account' ? (
                    <CircularProgress color='secondary' size={25} />
                  ) : (
                    'Connect'
                  )
                ) : (
                  truncate(defaultAccount)
                )}
              </Button>
              {/* {lang && (
              <Box className='last-button' sx={{ mt: { sm: 0.3, md: 1 } }}>
                <Dropdown
                  array={langList}
                  current={lang}
                  select={switchLang}
                  btnWidth={64}
                />
              </Box>
            )} */}
            </div>
          </Box>
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
