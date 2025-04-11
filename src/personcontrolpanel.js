import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LoadingContext } from './loadingcontext';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator() {
  const { sailorType, nameId } = useParams();
  const navigate = useNavigate();
  function RecordNavigatorBack() {
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate(process.env.PUBLIC_URL + '/' + sailorType + '/' + (Number(nameId) - 1))} ><WestIcon color='primary'/></IconButton>
    );
  }
  function RecordNavigatorForward() {
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate(process.env.PUBLIC_URL + '/' + sailorType + '/' + (Number(nameId) + 1))}><EastIcon color='primary'/></IconButton>
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
                if(intendedSailor.includes('/')) navigate(process.env.PUBLIC_URL + '/' + intendedSailor);
                else navigate(process.env.PUBLIC_URL + '/' + sailorType + '/' + e.target.value);
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

export default function PersonControlPanel({data, onChange, xCheckReady}) {
  const loading = useContext(LoadingContext);
  const {sailorType} = useParams();
  const navigate = useNavigate();
  return(
    <Stack
      spacing={3}
      sx={{
        justifyContent: "space-evenly",
        alignItems: "flex-end",
      }}>
      <RecordNavigator/>
      <Stack direction='row' alignItems='center'><Typography>{sailorType === 'rating' ? 'Progress' : 'Officers'}</Typography><IconButton><WestIcon color='primary' onClick={()=>{
        sailorType === 'rating' ?
          navigate(process.env.PUBLIC_URL + '/ratings/' + data.series + '/' + data.piece):
          navigate(process.env.PUBLIC_URL + '/officers/' + (data.surname ? data.surname.charAt(0) : 'null'))}}/></IconButton></Stack>
      { sailorType === 'rating' &&
        <FormControlLabel control={<Checkbox disabled={loading} checked={data.notWW1} onChange={(e)=>{onChange({...data, notWW1: !data.notWW1})}}/>} label='Not WW1' labelPlacement='start'/>
      }
    </Stack>
  );
}
