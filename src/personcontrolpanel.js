import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator() {
  return (
    <Stack direction='row' alignItems='center'>
      <IconButton><WestIcon color='primary'/></IconButton>
      <Typography>Record</Typography>
      <IconButton><EastIcon color='primary'/></IconButton>
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

export default function PersonControlPanel() {
  return(
    <Stack
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}>
      <XCheck/>
      <RecordNavigator/>
      <Stack direction='row' alignItems='center'><Typography>Progress</Typography><IconButton><WestIcon color='primary'/></IconButton></Stack>
      <FormControlLabel control={<Checkbox checked={false} onChange={(e)=>{console.log(e)}}/>} label='Not WW1' labelPlacement='start'/>
      <Button variant='contained'>EXTRAS</Button>
    </Stack>
  );
}
