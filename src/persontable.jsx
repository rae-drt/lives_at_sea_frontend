import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import style from './style';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function PersonTableField({data, onChange, field}) {
  const loading = useContext(LoadingContext);
  return (
    field in data ?
    <TextField
      disabled={loading}
      size='small'
      fullWidth
      value={data[field] === null ? '' : data[field]}
      onChange={(e)=>{
        const newData = {...data};
        newData[field] = e.target.value;
        onChange(newData);
      }}
    />:
    <div/>
  );
}

/* Each PersonTableRow is expected to be all or nothing: either all of its fields should exist, or none of them should. 
   At time of writing this is not actually tested for and should render OK if the rule is broken (but the label might not make sense)
 */
function PersonTableRow({onChange, data, rowCells, labels, fields}) {
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
  cells.push(<Grid key={counter++} size={rowCells - cellsPlaced}/>); //spacer
  return(cells);
}

export default function PersonTable({data, onChange, rows, rowCells}) {
  const table = [];
  let counter = 0;
  for(const row of rows) {
    table.push(<PersonTableRow key={counter++} labels={row.labels} fields={row.fields} data={data} onChange={onChange} rowCells={rowCells}/>);
  }

  return (
    <Grid container alignItems='flex-end' columns={7}>
      <Card sx={data.error ? style.differentCell : null}>
        <CardContent>
          <Stack direction='row' spacing={2}>
            <Grid container columns={rowCells} alignItems='center' justifyContent='flex-start'>
              {table}
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
