import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LoadingContext } from './loadingcontext';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import HappyIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator() {
  const { sailorType, nameId } = useParams();
  const navigate = useNavigate();
  function RecordNavigatorBack() {
    /*
    useEffect(() => {
      const fetchData = async() => {
        const response = await(fetch(process.env.REACT_APP_API_ROOT + 'nameid?pagesize=1&startafter=' + (id - 1)));
        if(!response.ok) {
          throw new Error('Bad response: ' + response.status);
        }
        const data = await(response.json());
        onChange(data.namelist[0]);
      }
      fetchData();
    }, [id, onChange]);
    */
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate('/' + sailorType + '/' + (Number(nameId) - 1))} ><WestIcon color='primary'/></IconButton>
    );
  }
  function RecordNavigatorForward() {
    /*
    useEffect(() => {
      const fetchData = async() => {
        const response = await(fetch(process.env.REACT_APP_API_ROOT + 'nameid?pagesize=1&startafter=' + (id - 1)));
        if(!response.ok) {
          throw new Error('Bad response: ' + response.status);
        }
        const data = await(response.json());
        onChange(data.namelist[0]);
      }
      fetchData();
    }, [id, onChange]);
      */
    const loading = useContext(LoadingContext);
    return(
      <IconButton disabled={loading} onClick={()=>navigate('/' + sailorType + '/' + (Number(nameId) + 1))}><EastIcon color='primary'/></IconButton>
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
                if(intendedSailor.includes('/')) navigate('/' + intendedSailor);
                else navigate('/' + sailorType + '/' + e.target.value);
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

export function XCheck({ready, checked, onChange}) {
  const loading = useContext(LoadingContext);
  return (
    <Stack direction='row' alignItems='center'>
      {ready ? <HappyIcon sx = {{color: 'green'}}/> : <SadIcon sx = {{color: 'red'}}/>}
      <FormControlLabel control={<Checkbox disabled={loading || (!ready)} checked={checked} onChange={onChange}/>} label='Xcheck' labelPlacement='start'/>
    </Stack>
  );
}

export default function PersonControlPanel({data, onChange, xCheckReady}) {
  const loading = useContext(LoadingContext);
  const {sailorType} = useParams();
  return(
    <Stack
      spacing={3}
      sx={{
        justifyContent: "space-evenly",
        alignItems: "flex-end",
      }}>
      { sailorType === 'rating' &&
        <XCheck ready={xCheckReady} checked={data.reconciled} onChange={()=>{onChange({...data, reconciled: !data.reconciled})}}/>
      }
      <RecordNavigator/>
      <Stack direction='row' alignItems='center'><Typography>Progress</Typography><IconButton><WestIcon color='primary'/></IconButton></Stack>
      { sailorType === 'rating' &&
        <FormControlLabel control={<Checkbox disabled={loading} checked={data.notWW1} onChange={(e)=>{onChange({...data, notWW1: !data.notWW1})}}/>} label='Not WW1' labelPlacement='start'/>
      }
    </Stack>
  );
}
