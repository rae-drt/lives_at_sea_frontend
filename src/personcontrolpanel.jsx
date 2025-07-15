import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import { LoadingContext } from './loadingcontext';

import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import WestIcon from '@mui/icons-material/ArrowBack'

export default function PersonControlPanel({navigator, data, onChange}) {
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
      {navigator}
      <Stack direction='row' alignItems='center'><Typography>{sailorType === 'rating' ? 'Progress' : 'Officers'}</Typography><IconButton><WestIcon color='primary' onClick={()=>{
        sailorType === 'rating' ?
          navigate('/ratings/' + data.piece):
          navigate('/officers/' + (data.surname ? data.surname.charAt(0) : 'null'))}}/></IconButton></Stack>
      { sailorType === 'rating' &&
        <FormControlLabel control={<Checkbox disabled={loading} checked={data.notww1} onChange={()=>{onChange({...data, notww1: !data.notww1})}}/>} label='Not WW1' labelPlacement='start'/>
      }
    </Stack>
  );
}
