import { useContext } from 'react';
import { Link } from 'react-router';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import PersonControlPanel from './personcontrolpanel';
import { LoadingContext } from './loadingcontext';
import { LockedContext } from './lockedcontext';

export function NewRecordButton() {
  const loading = useContext(LoadingContext);
  const [locked,] = useContext(LockedContext);
  return (
    <Stack direction='row' sx={{alignItems: 'center'}}>
      <Typography>New</Typography>
      <Link to={'/rating/0'}>
        <Tooltip title='Create another new record' sx={{fontSize:'large'}}>
          <IconButton disabled={loading || locked}>
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
