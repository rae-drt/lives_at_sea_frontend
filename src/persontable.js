import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import PersonControlPanel from './personcontrolpanel';

export default function PersonTable({data}) {
  return (
    <Stack alignItems='flex-start'>
      <Typography variant='h6'>Service record, ADM {data.catalogue}</Typography>
      <Stack direction='row' spacing={10} justifyContent='space-between'>
        <Card>
          <CardContent>
            <Stack direction='row' spacing={2}>
              <Grid container columns={7}>
                <Grid size={1} container alignItems='center'><Typography>Forename, surname</Typography></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.forename}/></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.surname}/></Grid>
                <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                <Grid size={1} container alignItems='center'><Typography>Official number</Typography></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.number}/></Grid>
                <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                <Grid size={1} container alignItems='center'><Typography>Born</Typography></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getDate()}/></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getMonth() + 1}/></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getFullYear()}/></Grid>
                <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                <Grid size={1} container alignItems='center'><Typography>Birth place, county</Typography></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.birthPlace}/></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.birthCounty}/></Grid>
                <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                <Grid size={1} container alignItems='center'><Typography>Occupation</Typography></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.occupation}/></Grid>
                <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                <Grid size={1} container alignItems='center'><Typography>Discharge date, reason</Typography></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getDate()}/></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getMonth() + 1}/></Grid>
                <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getFullYear()}/></Grid>
                <Grid size={3}><TextField fullWidth defaultValue= {data.dischargeReason}/></Grid>
                <Grid size={0}/>{ /*!-- Empty element to align row*/ }
              </Grid>
              <Stack
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <FormControlLabel control={<Checkbox checked={false} onChange={(e)=>{console.log(e)}}/>} label='Error?' labelPlacement='start'/>
                <Button variant='outlined' onClick={()=>{alert('clicked')}}>Enter</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Stack direction='row'>
          <PersonControlPanel/>
        </Stack>
      </Stack>
    </Stack>
  );
}
