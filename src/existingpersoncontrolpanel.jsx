import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LoadingContext } from './loadingcontext';
import PersonControlPanel from './personcontrolpanel';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator() {
  const { sailorType, nameId } = useParams();
  const navigate = useNavigate();
  function RecordNavigatorBack() {
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate('/person/' + sailorType + '/' + (Number(nameId) - 1))} ><WestIcon color='primary'/></IconButton>
    );
  }
  function RecordNavigatorForward() {
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate('/person/' + sailorType + '/' + (Number(nameId) + 1))}><EastIcon color='primary'/></IconButton>
    );
  }

  //re https://github.com/mui/material-ui/issues/5393, https://stackoverflow.com/questions/67578008/how-to-get-value-from-material-ui-textfield-after-pressing-enter
  function RecordNavigatorTeleport() {
    const [valid, setValid] = useState(true);
    const [popoverAnchor, setPopoverAnchor] = useState(false);

    return (
      <>
        <Typography onClick={(e)=>{setPopoverAnchor(e.currentTarget)}}>Record</Typography>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <TextField
            onKeyPress={(e) => {
              if(e.key === 'Enter' && valid) {
                const intendedSailor = e.target.value.trim();
                if(intendedSailor.includes('/')) navigate('/person/' + intendedSailor);
                else navigate('/person/' + sailorType + '/' + e.target.value);
                setPopoverAnchor(false);
              }
            }}
            onKeyDown={(e)=>{e.key === 'Escape' && setPopoverAnchor(false);}}
            defaultValue={nameId}
            onChange={(e)=>{setValid(/(?:rating\/|officer\/)?\d+$/.test(e.target.value.trim()));}}
            error={!valid}
            helperText={valid || 'Enter nameid with optional sailor type. Examples: 100123; rating/100123; officer/7.'}
          />
        </Popover>
      </>
    );
  }

  return (
    <Stack direction='row' alignItems='center'>
      <RecordNavigatorBack/>
      <RecordNavigatorTeleport/>
      <RecordNavigatorForward/>
    </Stack>
  );
}

export default function ExistingPersonControlPanel(props) {
  return (
    <PersonControlPanel navigator={<RecordNavigator/>} {...props}/>
  );
}
