import { Link } from 'react-router';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import PersonControlPanel from './personcontrolpanel';

export function NewRecordButton() {
  return (
    <Stack direction='row' sx={{alignItems: 'center'}}>
      <Typography>New</Typography>
      <Link to={process.env.PUBLIC_URL + '/rating/0'}>
        <Tooltip title='Create another new record' sx={{fontSize:'large'}}>
          <IconButton>
            <NoteAddIcon color='primary' fontSize='large'/>
          </IconButton>
        </Tooltip>
      </Link>
    </Stack>
  );
}

export default function NewPersonControlPanel(props) {
  return (
    <PersonControlPanel navigator={<NewRecordButton/>} {...props}/>
  );
}
