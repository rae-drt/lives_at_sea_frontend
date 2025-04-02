import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import { DataGrid, GridColDef, GridColumnGroupingModel, gridClasses } from '@mui/x-data-grid';
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

export default function DataTable(props) {
  const loading = useContext(LoadingContext);
  const {rows, columns, onChange, extraRowControls, sx, ...otherProps} = props;

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
    // TODO: is row.row guaranteed to be an integer? (i.e. not a string)
    const {row, ...otherParams} = params;
    const emptyRow = {};
    for(const k of Object.keys(row)) emptyRow[k] = null;
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
                newRows.push({...emptyRow, row: row.row});
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
                newRows.push({...emptyRow, row: row.row + 1});
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
        {extraRowControls && extraRowControls(params, sx)/*TODO: This feels hairy. Either verify that this is a legit thing to do with this API (a second function looking at the parameters) or at least build in enough testing that we'll know if it breaks.*/}
      </Stack>
    );
  };

  return table;
}
