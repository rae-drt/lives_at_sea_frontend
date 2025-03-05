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

export default function PersonTable({data, onChange}) {
  if(typeof data !== 'undefined') {
    return (
      <Stack direction='row' alignItems='flex-start' justifyContent='space-between' spacing={5}>
        <Grid container alignItems='flex-end' columns={7}>
          <Grid container size={5} justifyContent='flex-start'><Typography variant='h6'>Service record, ADM {data.series}/{data.piece}/{data.officialnumber}</Typography></Grid>
          <Grid size={1}><FormControlLabel control={<Checkbox checked={false} onChange={(e)=>{console.log(e)}}/>} label='Error?' labelPlacement='start'/></Grid>
          <Grid container size={1} justifyContent='flex-end'><Button variant='outlined' onClick={()=>{alert('clicked')}}>Enter</Button></Grid>

          <Grid size={7}>
            <Card>
              <CardContent>
                <Stack direction='row' spacing={2}>
                  <Grid container columns={8} alignItems='center' justifyContent='flex-start'>
                    <Grid size={2} container direction='row'><Typography>Forename, surname</Typography></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.forename} onChange={(e)=>{onChange({...data, forename: e.target.value});}}/></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.surname} onChange={(e)=>{onChange({...data, surname: e.target.value});}}/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Official number</Typography></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.officialnumber} onChange={(e)=>{onChange({...data, officialnumber: e.target.value});}}/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Born</Typography></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.birthday} onChange={(e)=>{onChange({...data, birthday: e.target.value});}}/></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.birthmonth} onChange={(e)=>{onChange({...data, birthmonth: e.target.value});}}/></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.birthyear} onChange={(e)=>{onChange({...data, birthyear: e.target.value});}}/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Birth place, county</Typography></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.birthplace} onChange={(e)=>{onChange({...data, birthplace: e.target.value});}}/></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.birthcounty} onChange={(e)=>{onChange({...data, birthcounty: e.target.value});}}/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Occupation</Typography></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.occupation} onChange={(e)=>{onChange({...data, occupation: e.target.value});}}/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Discharge date, reason</Typography></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.dischargeday} onChange={(e)=>{onChange({...data, dischargeday: e.target.value});}}/></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.dischargemonth} onChange={(e)=>{onChange({...data, dischargemonth: e.target.value});}}/></Grid>
                    <Grid size={1}><TextField size='small' fullWidth defaultValue= {data.dischargeyear} onChange={(e)=>{onChange({...data, dischargeyear: e.target.value});}}/></Grid>
                    <Grid size={3}><TextField size='small' fullWidth defaultValue= {data.dischargereason} onChange={(e)=>{onChange({...data, dischargereason: e.target.value});}}/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <PersonControlPanel/>
      </Stack>
    );
  }
  else {
    return(<Typography>Fetching...</Typography>);
  }
}
