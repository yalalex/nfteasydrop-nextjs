import { IconButton } from '@mui/material';

import { externalLinks } from '../../config';

const ExternalLink = ({ icon, i, drawer = false }) => {
  return (
    <a
      href={Object.values(externalLinks)[i]}
      target='_blank'
      rel='noopener noreferrer'
      className={!drawer && 'icon-container'}
    >
      <IconButton
        size='large'
        color='secondary'
        aria-label={`visit ${Object.keys(externalLinks)[i]}`}
        className={!drawer && 'icon-button'}
      >
        {icon}
      </IconButton>
    </a>
  );
};

export default ExternalLink;
