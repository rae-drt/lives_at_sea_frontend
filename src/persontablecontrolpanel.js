import { useDirty } from './dirty';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { catref, officerref } from './data_utils'

export default function PersonTableControlPanel({data, onChange}) {
  const {sailorType} = useParams();
  const dirty = useDirty((state)=>state.person);
  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' spacing={2}>
          <Typography variant='h6'>{sailorType === 'officer' ? 'Officer #' + officerref(data) : catref(data)}</Typography>
          <Stack direction='row' spacing={2}>
            {'error' in data && <FormControlLabel control={<Checkbox checked={data.error} disabled={true}/>} label='Error?' labelPlacement='start'/>}
            <Button disabled={!dirty} variant='outlined' onClick={onChange}>Enter</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
