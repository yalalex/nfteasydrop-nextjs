import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import logo from '../../public/logos/logo.png';

import { internalLinks } from '../../config';

import ExternalLink from './ExternalLink';

const NavbarDrawer = ({ handleDrawerToggle, mobileOpen, icons }) => {
  const router = useRouter();
  return (
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
            width: 240,
          },
        }}
      >
        <Box onClick={handleDrawerToggle} className='drawer'>
          <Link href='/'>
            <IconButton size='large' color='primary' aria-label='NFT Easy Drop'>
              <Image src={logo} height={45} width={109} alt='NFT Easy Drop' />
            </IconButton>
          </Link>
          <Divider />
          <List sx={{ marginTop: -1 }}>
            {internalLinks.map((link) => (
              <ListItem key={link.id} disablePadding>
                <ListItemButton
                  className='link-container'
                  sx={{
                    background:
                      router.pathname === link.path &&
                      'rgba(255, 255, 255, 0.05)',
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
                {icons.map((icon, i) => (
                  <ExternalLink key={i} icon={icon} drawer={mobileOpen} i={i} />
                ))}
              </div>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavbarDrawer;
