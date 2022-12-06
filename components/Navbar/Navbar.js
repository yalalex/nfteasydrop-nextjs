import { useState, useMemo } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  Box,
  AppBar,
  IconButton,
  List,
  ListItem,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

import { internalLinks } from '../../config';
import logo from '../../public/logos/logo.png';

import Drawer from './Drawer';
import ExternalLink from './ExternalLink';
import Buttons from './Buttons';

const Navbar = () => {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const icons = [
    <Image
      src='/icons/ether.svg'
      priority={true}
      width='24'
      height='24'
      alt=''
    />,
    <TwitterIcon />,
    <TelegramIcon />,
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
          {/* logo */}
          <Link href='/'>
            <IconButton
              color='secondary'
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
                alt='NFT Easy Drop'
              />
            </IconButton>
          </Link>
          {/* internal links */}
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <div className='links-container'>
              {internalLinks.map((link) => (
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
            {/* external links */}
            <div className='links-container'>
              <List sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                {icons.map((icon, i) => (
                  <ListItem key={i} disablePadding>
                    <ExternalLink icon={icon} drawer={mobileOpen} i={i} />
                  </ListItem>
                ))}
              </List>
              {/* buttons */}
              <Buttons />
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        icons={icons}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
    </>
  );
};

export default Navbar;
