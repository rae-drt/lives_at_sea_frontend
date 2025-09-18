import { useContext } from 'react';
import { useSearchParams } from 'react-router';
import { DirtySailorContext } from './dirty';
import { snapshot } from './snapshot';
import { usePrefs } from './prefs';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { catref, officerref } from './data_utils';

export default function PersonTableControlPanel({data, onChange}) {
  const {sailorType} = useParams();
  const [searchParams,] = useSearchParams();
  const screenshot = usePrefs((state)=>state.screenshot);
  const dirty = useContext(DirtySailorContext).name;
  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' spacing={2}>
          <Typography variant='h6'>{sailorType === 'officer' ? 'Officer #' + officerref(data) : catref(data)}</Typography>
          <Stack direction='row' spacing={2}>
            {'error' in data && <FormControlLabel control={<Checkbox checked={data.error} disabled={true}/>} label='Error?' labelPlacement='start'/>}
            <Button disabled={!dirty} variant='outlined' onClick={()=>{snapshot('person_for_snapshot', searchParams.get('devMode'), screenshot, data, data.person_id).then(()=>onChange())}}>Enter</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
