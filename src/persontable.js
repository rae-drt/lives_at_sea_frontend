import { useState, useEffect } from 'react';
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

export function PersonTableField({data, onChange, field}) {
  return (
    <TextField
      size='small'
      fullWidth
      value={data[field]}
      onChange={(e)=>{
        const newData = {...data};
        newData[field] = e.target.value;
        onChange(newData);
      }}
    />
  );
}

export default function PersonTable({id, onChange}) {
  const [data, setData] = useState();
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    console.warn('Triggered personTableData effect (nameID === ' + id + ')');
    const fetchData = async() => {
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + id));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      console.log('Effect: ', data);
      setData(data);
      setFetching(false);
      //setPersonTableData(personTableData); //For when I have no network
    }
    fetchData();
    console.warn('Completed personTableData effect (nameID === ' + id + ')');
  }, [id]);
  console.log('Render: ', data);
  if(fetching) {
    return <Typography>Fetching...</Typography>
  }
  else {
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
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='forename'/></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='surname'/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Official number</Typography></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='officialnumber'/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Born</Typography></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='birthday'/></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='birthmonth'/></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='birthyear'/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Birth place, county</Typography></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='birthplace'/></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='birthcounty'/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Occupation</Typography></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='occupation'/></Grid>
                    <Grid size={3}/>{ /*!-- Empty element to align row*/ }

                    <Grid size={2} container direction='row' alignItems='flex-start'><Typography>Discharge date, reason</Typography></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='dischargeday'/></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='dischargemonth'/></Grid>
                    <Grid size={1}><PersonTableField data={data} onChange={setData} field='dischargeyear'/></Grid>
                    <Grid size={3}><PersonTableField data={data} onChange={setData} field='dischargereason'/></Grid>
                    <Grid size={0}/>{ /*!-- Empty element to align row*/ }
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <PersonControlPanel data={data} onChange={onChange}/>
      </Stack>
    );
  }
}
