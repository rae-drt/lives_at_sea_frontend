import { useContext } from 'react';
import { DirtySailorContext } from './dirty';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { catref, officerref } from './data_utils';
import { LoadingContext }  from './loadingcontext';
import { LockedContext } from './lockedcontext';

export default function PersonTableControlPanel({data, onChange}) {
  const {sailorType} = useParams();
  const loading = useContext(LoadingContext);
  const [locked,] = useContext(LockedContext);
  const dirty = useContext(DirtySailorContext).name;
  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' spacing={2}>
          <Typography variant='h6'>{sailorType === 'officer' ? 'Officer #' + officerref(data) : catref(data)}</Typography>
          <Stack direction='row' spacing={2}>
            {'error' in data && <FormControlLabel control={<Checkbox checked={data.error} disabled={true}/>} label='Error?' labelPlacement='start'/>}
            <Button disabled={(!dirty) || loading || locked} variant='outlined' onClick={onChange}>Enter</Button>
            {/* It looks like it is possible for a user to enter data between click and mutate, given
              * some delay between click and mutate. HOWEVER observation shows that the event appears
              * to occur within the context of the state at the point that the event began: even if the
              * user edits the data between click and mutate, those edits are simply ignored. Which really
              * is the behaviour that we want for any sensible kind of atomicity. While not a great user
              * experience it is in practice nearly impossible for the user to do this anyway. */}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
