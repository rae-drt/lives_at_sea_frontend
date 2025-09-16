import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import style from './style';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PERSON_FIELD_TYPES, PERSON_FIELD_VALIDATORS } from './data_utils';

function PersonTableField({data, onChange, field, error}) {
  const loading = useContext(LoadingContext);
  const fieldType = PERSON_FIELD_TYPES[field];
  const fieldValue = (field in data && data[field] !== null) ? data[field] : '';
  function hasError() {
    if(error) return true;
    if(fieldType === 'text') {
      if(typeof(fieldValue) !== 'string') return true;
    }
    else if(fieldType === 'number') {
      if(typeof(fieldValue) !== 'number') {
        if(typeof(fieldValue) === 'string' && fieldValue.trim() === '') {
          return false;
        }
        return true;
      }
    }
    else {
      throw new Error(`Field "${field}" has unknown type "${fieldType}"`);
    }
    return !(PERSON_FIELD_VALIDATORS[field](fieldValue));
  }

  return (
    <TextField
      disabled={loading}
      size='small'
      fullWidth
      type={fieldType}
      value={fieldValue}
      onBlur={(e)=>{ //i.e. on loss of focus
        if(fieldType === 'number' && e.target.value.trim() === '') {
          const newData = structuredClone(data);
          newData[field] = 0;
          onChange(newData);
        }
      }}
      onChange={(e)=>{
        const newData = structuredClone(data);
        let newValue = e.target.value;
        if(fieldType === 'number') {
          if(newValue.match(/^\d+$/)) {
            newValue = Number(newValue);
          }
        }
        newData[field] = newValue;
        onChange(newData);
      }}
      error={hasError()}
    />
  );
}

/* Each PersonTableRow is expected to be all or nothing: either all of its fields should exist, or none of them should. 
   At time of writing this is not actually tested for and should render OK if the rule is broken (but the label might not make sense)
 */
function PersonTableRow({onChange, data, rowCells, labels, fields, error}) {
  let counter = 0;
  let cells = [];
  let cellsPlaced = 0;
  for(const label in labels) {
    cells.push(<Grid container key={counter++} direction='row' size={labels[label]}><Typography>{label}</Typography></Grid>);
    cellsPlaced += labels[label];
  }
  for(const field in fields) {
    cells.push(<Grid key={counter++} size={fields[field]}><PersonTableField data={data} onChange={onChange} field={field} error={error.includes(field)}/></Grid>);
    cellsPlaced -= fields[field];
  }
  cells.push(<Grid key={counter++} size={rowCells - cellsPlaced}/>); //spacer
  return(cells);
}

export default function PersonTable({data, onChange, rows, rowCells}) {
  const table = [];
  let counter = 0;
  for(const row of rows) {
    table.push(<PersonTableRow key={counter++} labels={row.labels} fields={row.fields} error={row.validator(data)} data={data} onChange={onChange} rowCells={rowCells}/>);
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
