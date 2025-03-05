import {useEffect} from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator({nameId, onChangeNameId}) {
  function RecordNavigatorBack({id, onChange}) {
    /*
    useEffect(() => {
      console.warn('Triggered nameId backward effect (nameId === ' + id + ')');
      const fetchData = async() => {
        const response = await(fetch(process.env.REACT_APP_API_ROOT + 'nameid?pagesize=1&startafter=' + (id - 1)));
        if(!response.ok) {
          throw new Error('Bad response: ' + response.status);
        }
        const data = await(response.json());
        onChange(data.namelist[0]);
        console.log('New nameId: ' + data.namelist[0]);
      }
      fetchData();
      console.warn('Completed nameId effect (nameId === ' + id + ')');
    }, [id, onChange]);
    */
    return(
      <IconButton onClick={()=>onChange(id - 1)} ><WestIcon color='primary'/></IconButton>
    );
  }
  function RecordNavigatorForward({id, onChange}) {
    /*
    useEffect(() => {
      console.warn('Triggered nameId forward effect (nameId === ' + id + ')');
      const fetchData = async() => {
        const response = await(fetch(process.env.REACT_APP_API_ROOT + 'nameid?pagesize=1&startafter=' + (id - 1)));
        if(!response.ok) {
          throw new Error('Bad response: ' + response.status);
        }
        const data = await(response.json());
        onChange(data.namelist[0]);
        console.log('New nameId: ' + data.namelist[0]);
      }
      fetchData();
      console.warn('Completed nameId effect (nameId === ' + id + ')');
    }, [id, onChange]);
      */
    return(
      <IconButton onClick={()=>onChange(id + 1)}><EastIcon color='primary'/></IconButton>
    );
  }
  return (
    <Stack direction='row' alignItems='center'>
      <RecordNavigatorBack id={nameId} onChange={onChangeNameId}/>
      <Typography>Record</Typography>
      <RecordNavigatorForward id={nameId} onChange={onChangeNameId}/>
    </Stack>
  );
}

export function XCheck() {
  return (
    <Stack direction='row' alignItems='center'>
      <SadIcon sx = {{color: 'red'}}/>
      <FormControlLabel control={<Checkbox disabled checked={false} onChange={(e)=>{console.log(e)}}/>} label='Xcheck' labelPlacement='start'/>
    </Stack>
  );
}

export default function PersonControlPanel({data, onChange, nameId, onChangeNameId}) {
  return(
    <Stack
      spacing={3}
      sx={{
        justifyContent: "space-evenly",
        alignItems: "flex-end",
      }}>
      <XCheck/>
      <RecordNavigator nameId={nameId} onChangeNameId={onChangeNameId}/>
      <Stack direction='row' alignItems='center'><Typography>Progress</Typography><IconButton><WestIcon color='primary'/></IconButton></Stack>
      <FormControlLabel control={<Checkbox checked={data.notWW1} onChange={(e)=>{onChange({...data, notWW1: !data.notWW1})}}/>} label='Not WW1' labelPlacement='start'/>
      <Button variant='contained'>EXTRAS</Button>
    </Stack>
  );
}
