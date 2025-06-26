import { useContext } from 'react';
import { useDialogs } from '@toolpad/core/useDialogs';
import { LoadingContext } from './loadingcontext';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InsertAboveIcon from '@mui/icons-material/Publish';
import InsertBelowIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function checkPrimary(cols, primary) {
  for(const col of cols) {
    if(col.field === primary) {
      if(col.editable) throw new Error('Primary key ' + primary + ' should not be editable');
      return;
    }
  }
  if(cols.length) throw new Error('Primary key ' + primary + ' not defined in columns');
}

//Tables of rows because of the ServiceReconciler use case, where we have two rows but only want to pop up one dialog
export function useEmptyRowOK(tables_of_rows, primary) {
  const dialogs = useDialogs();

  function hasEmptyRow(rows, primary) {
    outer: for(const row of rows) {
      for(const [k, v] of Object.entries(row)) {
        if(k === primary) continue;
        if(v) continue outer;
      }
      return true; //this row had no values in any non-primary key
    }
    return false; //all rows had at least one "real" value
  }

  //return of true meaning "ok to save" -- either there are no empty rows, or the user has asked to save them
  return async () => {
    if(tables_of_rows.some((rows) => hasEmptyRow(rows, primary))) {
      return dialogs.confirm('This record contains empty rows. Save anyway?', {
        title: 'Empty rows',
        okText: 'Save',
        cancelText: 'Cancel',
      });
    }
    else {
      return true;
    }
  }
}

export function DataTable(props) {
  const {rows, columns, onChange, primary, positionalPrimary, extraRowControls, controlCount, sx, ...otherProps} = props;
  const loading = useContext(LoadingContext);
  const theme = useTheme();
  function addButton() {
    return (
      <Stack alignItems='center'>
        <Typography variant='caption'>No rows</Typography>
        <Button variant='outlined' onClick={()=>{onChange([{[primary]: 1}])}}>Add first row</Button>
      </Stack>
    );
  }

  const finalOnChange = (data) => {
    if(positionalPrimary) {
      onChange(data.sort((a,b)=>a[primary] - b[primary]));
    }
    else {
      onChange(data);
    }
  };

  checkPrimary(columns, primary);

  function baseRowControls(params) {
    const {row} = params; //const {row, ...otherParams} = params; would give access to the rest of the params if needed
    const sx = {
      px: 0.2,
      py: 0,
    }
    let insertionButtons = null;
    if(positionalPrimary) {
        function insert(pos) {
          const newRows = rows.map((e) => {
            const clone = structuredClone(e);
            if(e[primary] >= pos) clone[primary] += 1;
            return clone;
          })
          newRows.push({[primary]: pos});
          return newRows;
        }
        insertionButtons = (<>
          <Tooltip title='Insert row above' placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} fontSize='inherit' color='primary' onClick={()=>{finalOnChange(insert(row[primary]))}}>
                <InsertAboveIcon/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Insert row below' placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} fontSize='inherit' color='primary' onClick={()=>{finalOnChange(insert(row[primary] + 1))}}>
                <InsertBelowIcon/>
              </IconButton>
            </span>
          </Tooltip>
        </>);
    }
    return (
      <Stack direction='row' spacing={0}>
        {insertionButtons}
        <Tooltip title='Delete row' placement='top' followCursor arrow>
          <span>
            <IconButton sx={sx} fontSize='inherit' color='primary' onClick={()=>{
              const newRows = [];
              for(const x of rows) {
                if(x[primary] === row[primary]) continue;
                const newRow = structuredClone(x);
                if(positionalPrimary && (x[primary] > row[primary])) newRow[primary] -= 1;
                newRows.push(newRow);
              }
              finalOnChange(newRows);
            }}>
              <DeleteIcon/>
            </IconButton>
          </span>
        </Tooltip>
        {typeof(extraRowControls) !== 'undefined' && extraRowControls(params, sx)/*TODO: This feels hairy. Either verify that this is a legit thing to do with this API (a second function looking at the parameters) or at least build in enough testing that we'll know if it breaks.*/}
      </Stack>
    );
  };

  const initialState = {};
  if(positionalPrimary) {
    initialState.sorting = {sortModel: [{field: primary, sort: 'asc'}]};
    if(otherProps.disableColumnSorting === false) throw new Error('Data table with positional primary cannot be sortable');
  }
  else {
    initialState.sorting = {sortModel: [{field: primary, sort: 'desc'}]};
    initialState.columns = {
      columnVisibilityModel: {
        [primary]: false
      },
    }
  }

  return(
    <DataGrid
      loading={loading}
      density='compact'
      rows={rows}
      columns={[...columns, {
          field: 'row_controls',
          headerName: '',
          width: theme.typography.fontSize * 2.2 * (controlCount ? controlCount : 3),
          minWidth: theme.typography.fontSize * 2.2 * (controlCount ? controlCount : 3),
          renderCell: baseRowControls,
        },
      ]}
      slots = {{ noRowsOverlay: addButton }}
      initialState={initialState}
      getRowId={(row) => {return row[primary];}}
      processRowUpdate={(updatedRow, originalRow, {rowId}) =>{
        finalOnChange(rows.map((e) => e[primary] === rowId ? structuredClone(updatedRow) : structuredClone(e)));
        return updatedRow;
      }}
      hideFooter={!(rows)}
      onProcessRowUpdateError={(e)=>{alert(e);}}
      disableColumnSorting={positionalPrimary}
      disableColumnMenu={positionalPrimary}
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
        '&& .MuiDataGrid-editInputCell input': { padding: 0 },
      }}
      {...otherProps}
    />);
}
