import { useContext, useEffect } from 'react';
import { LoadingContext } from './loadingcontext';

import { DataGrid, GridColDef, GridColumnGroupingModel, gridClasses } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InsertAboveIcon from '@mui/icons-material/Publish';
import InsertBelowIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import OverwriteThatIcon from '@mui/icons-material/KeyboardArrowRight';
import InsertThatIcon from '@mui/icons-material/MenuOpen';

/* Confirm that the passed data array is safe to use in the table interfaces, which assume a row property one greater than array index.
 * If the array is undefined or empty then it is necessarily safe.
 * Otherwise, all members of the array must:
 *   1. Have a row property
 *   2. The row property must be an integer
 *   3. The row property must be one greater than the array index of the member
 * Additionally, the first member of the array must have a row of 1.
 */
function valid_rows(data_array) {
  if(typeof(data_array) === 'undefined') {
    return true;
  }
  if(data_array.length === 0) {
    return true;
  }
  for(let i = 0; i < data_array.length; i++) {
    if('row' in data_array[i] === false) {
      return false;
    }
    if(Number.isInteger(data_array[i].row) === false) {
      return false;
    }
    if(data_array[i].row !== i + 1) {
      return false;
    }
  }
  return data_array[0].row === 1;
}

function need_empty_last(data_array) {
  const _ = require('lodash');
  if(typeof(data_array) === 'undefined') return false;
  if(data_array.length === 0) return true;
  return !(_.isEqual(Object.keys(data_array[data_array.length - 1]), ['row']));
}

export default function DataTable(props) {
  const loading = useContext(LoadingContext);
  useEffect(() => {
    if(need_empty_last(rows)) {
      const newRows = structuredClone(rows);
      newRows.push({row: rows.length + 1});
      onChange(newRows);
    }
  }, [props.rows]);
  const {rows, columns, onChange, extraRowControls, sx, ...otherProps} = props;

  if(!valid_rows(rows)) {
    return(<Alert severity='error'>Rows do not start at 1 and/or are not consecutive.</Alert>);
  }

  const table = <DataGrid
    loading={loading}
    density='compact'
    rows={rows}
    columns={[...columns, {
        field: 'row_controls',
        headerName: '',
        width: 160,
        renderCell: baseRowControls,
      },
    ]}
    getRowId = {(row) => {return row.row;}}
    onCellEditStop = {(cellParams, e) => {
      if('target' in e) { //if we click out without changing anything, e does not have a target (maybe not even an event, but this works) TODO is there an accepted way to handle this?
        const newRows = structuredClone(rows);
        newRows[cellParams.id - 1][cellParams.field] = e.target.value;
        onChange(newRows);
      }
    }}
    disableColumnSorting
    disableColumnMenu
    getRowHeight={()=>'auto'}
    sx={{
      ...sx,
      [`.${gridClasses.cell}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: '0px',
        pl: '3px',
        pr: '3px',
      },
      '& .MuiDataGrid-cell, .MuiDataGrid-columnHeader': { py: '3px', border: 1 },
      '& .MuiDataGrid-columnSeparator': { display: 'none' },
      '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
    }}
    {...otherProps}
  />;

  function baseRowControls(params) {
    // row.row is the row number as presented in the table. This is one higher than the array index of the row.
    const {row, ...otherParams} = params;
    const sx = {
      px: 0.2,
      py: 0,
    }
    return (
      <Stack direction='row' spacing={0}>
        <Tooltip title='Insert row above' placement='top' followCursor arrow>
          <span>
            <IconButton sx={sx} color='primary' onClick={()=>{
                const newRows = structuredClone(rows.slice(0, row.row - 1));
                newRows.push({row: row.row});
                newRows.push(...structuredClone(rows.slice(row.row - 1)));
                for(const x of newRows.slice(row.row)) x['row'] += 1;
                onChange(newRows);
              }}>
              <InsertAboveIcon/>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Insert row below' placement='top' followCursor arrow>
          <span>
            <IconButton sx={sx} color='primary' onClick={()=>{
                const newRows = structuredClone(rows.slice(0, row.row));
                newRows.push({row: row.row + 1});
                newRows.push(...structuredClone(rows.slice(row.row)));
                for(const x of newRows.slice(row.row + 1)) x['row'] += 1;
                onChange(newRows);
              }}>
              <InsertBelowIcon/>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Delete row' placement='top' followCursor arrow>
          <span>
            <IconButton sx={sx} color='primary' onClick={()=>{
                const newRows = structuredClone(rows.slice(0, row.row - 1));
                newRows.push(...structuredClone(rows.slice(row.row)));
                for(const x of newRows.slice(row.row - 1)) x['row'] -= 1;
                onChange(newRows);
              }}>
              <DeleteIcon/>
            </IconButton>
          </span>
        </Tooltip>
        {typeof(extraRowControls) !== 'undefined' && extraRowControls(params, sx)/*TODO: This feels hairy. Either verify that this is a legit thing to do with this API (a second function looking at the parameters) or at least build in enough testing that we'll know if it breaks.*/}
      </Stack>
    );
  };

  return table;
}
