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

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'fromDate',
    headerName: 'From',
    children: [ { field: 'fromday' }, { field: 'frommonth' }, { field: 'fromyear' } ],
  },
  { groupId: 'toDate',
    headerName: 'To',
    children: [ { field: 'today'   }, { field: 'tomonth'   }, { field: 'toyear'   } ],
  },
]

const columns: GridColDef[] = [
  {
    field: 'row',
    headerName: 'Row',
    width: 50,
  },
  {
    field: 'ship',
    headerName: 'Ship',
    editable: true,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    width: 75,
    editable: true,
  },
  {
    field: 'fromday',
    headerName: 'D',
    width: 40,
    minWidth: 40,
    editable: true,
  },
  {
    field: 'frommonth',
    headerName: 'M',
    width: 30,
    minWidth: 40,
    editable: true,
  },
  {
    field: 'fromyear',
    headerName: 'Y',
    width: 50,
    editable: true,
  },
  {
    field: 'today',
    headerName: 'D',
    width: 40,
    minWidth: 40,
    editable: true,
  },
  {
    field: 'tomonth',
    headerName: 'M',
    width: 40,
    minWidth: 40,
    editable: true,
  },
  {
    field: 'toyear',
    headerName: 'Y',
    width: 50,
    editable: true,
  },
];

export function TranscriptionInfo({transcriber, complete, flipComplete}) {
  return (
    <Stack direction='row' spacing={4} alignItems='center'>
      <Typography>Transcriber: {transcriber}</Typography>
      <FormControlLabel control={<Checkbox checked={complete} onChange={flipComplete}/>} label='Complete' labelPlacement='start'/>
    </Stack>
  );
}

export default function ServiceTable({transcriber, complete, flipComplete, data, onChange, difference}) {
  const loading = useContext(LoadingContext);

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            [`.${gridClasses.cell}.differs`]: {
              backgroundColor: '#ff943975',
              color: '#1a3e72',
            },
          }}
        >
          <TranscriptionInfo transcriber={transcriber} complete={complete} flipComplete={flipComplete}/>
          <DataGrid
            getCellClassName={(p) => {
              if(difference.length > 0) {
                if(p.id > difference.length) {
                  return 'differs';
                }
                else if(p.field in difference[p.id - 1]) {
                  return 'differs';
                }
              }
            }}
            loading={loading}
            density='compact'
            rows={data}
            columns={columns}
            getRowId = {(row) => {return row.row;}}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            onCellEditStop = {(cellParams, e) => {
              if('target' in e) { //if we click out without changing anything, e does not have a target (maybe not even an event, but this works) TODO is there an accepted way to handle this?
              const newData = structuredClone(data);
              newData[cellParams.id - 1][cellParams.field] = e.target.value;
              onChange(newData);}
            }}
            pageSizeOptions={[20]}
            disableColumnSorting
            disableColumnMenu
            columnGroupingModel={columnGroupingModel}
            getRowHeight={()=>'auto'}
            sx={{
              '& .MuiDataGrid-cell, .MuiDataGrid-columnHeader': { py: '3px', border: 1 },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
