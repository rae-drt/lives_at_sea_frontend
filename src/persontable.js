import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';
import { catref } from './data_utils'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

export function PersonTableField({data, onChange, field}) {
  const loading = useContext(LoadingContext);
  return (
    field in data ?
    <TextField
      disabled={loading}
      size='small'
      fullWidth
      value={data[field]}
      onChange={(e)=>{
        const newData = {...data};
        newData[field] = e.target.value;
        onChange(newData);
      }}
    />:
    <div/>
  );
}

export default function PersonTable({data, onChange}) {
  const ROW_CELLS = 8;

  /* Each PersonTableRow is expected to be all or nothing: either all of its fields should exist, or none of them should. 
     At time of writing this is not actually tested for and should render OK if the rule is broken (but the label might not make sense)
   */
  function PersonTableRow({labels, fields}) {
    if(typeof(data) === 'undefined') return <div/>;
    for(const field in fields) {
      if(!(field in data)) {
        return <div/>;
      }
    }
    let counter = 0;
    let cells = [];
    let cellsPlaced = 0;
    for(const label in labels) {
      cells.push(<Grid container key={counter++} direction='row' size={labels[label]}><Typography>{label}</Typography></Grid>);
      cellsPlaced += labels[label];
    }
    for(const field in fields) {
      cells.push(<Grid key={counter++} size={fields[field]}><PersonTableField data={data} onChange={onChange} field={field}/></Grid>);
      cellsPlaced -= fields[field];
    }
    cells.push(<Grid key={counter++} size={ROW_CELLS - cellsPlaced}/>); //spacer
    return(cells);
  }

  return (
    <Grid container alignItems='flex-end' columns={7}>
      <Grid container size={5} justifyContent='flex-start'><Typography variant='h6'>Service record, {catref(data)}</Typography></Grid>
      <Grid size={1}><FormControlLabel control={<Checkbox checked={data.error} disabled={true}/>} label='Error?' labelPlacement='start'/></Grid>
      <Grid container size={1} justifyContent='flex-end'><Button variant='outlined' onClick={()=>{alert('clicked')}}>Enter</Button></Grid>
      <Grid size={7}>
        <Card sx={{background: data.error ? '#ff943975' : '#ffffffff'}}>
          <CardContent>
            <Stack direction='row' spacing={2}>
              <Grid container columns={ROW_CELLS} alignItems='center' justifyContent='flex-start'>
                <PersonTableRow labels={{'Forename, surname': 2}}      fields={{forename: 3, surname:3}}/>
                <PersonTableRow labels={{'Official number': 2}}        fields={{officialnumber: 3}}/>
                <PersonTableRow labels={{'Born': 2}}                   fields={{birthday: 1, birthmonth: 1, birthyear: 1}}/>
                <PersonTableRow labels={{'Birth place, county': 2}}    fields={{birthplace: 3, birthcountry: 3}}/>
                <PersonTableRow labels={{'Occupation': 2}}             fields={{occupation: 3}}/>
                <PersonTableRow labels={{'Discharge date, reason': 2}} fields={{dischargeday: 1, dischargemonth: 1, dischargeyear: 1, dischargereason: 3}}/>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
