import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useEffect } from 'react';
import { useGridApiRef } from "@mui/x-data-grid";
import ReactDOM from 'react-dom';

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
    headerName: 'Row'
  },
  {
    field: 'ship',
    headerName: 'Ship',
    editable: true,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    editable: true,
  },
  {
    field: 'fromday',
    headerName: 'D',
    editable: true,
  },
  {
    field: 'frommonth',
    headerName: 'M',
    editable: true,
  },
  {
    field: 'fromyear',
    headerName: 'Y',
    editable: true,
  },
  {
    field: 'today',
    headerName: 'D',
    editable: true,
  },
  {
    field: 'tomonth',
    headerName: 'M',
    editable: true,
  },
  {
    field: 'toyear',
    headerName: 'Y',
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

export default function ServiceTable({transcriptionInfo, flipComplete, data}) {
  const loading = useContext(LoadingContext);

  const apiRef = useGridApiRef();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      ReactDOM.flushSync(() => {
        //apiRef.current.updateRows(data); This is in the example here https://github.com/mui/mui-x/issues/10578 (number 3, the preferred option) but is not usable in free version of DataGrid
        apiRef.current.autosizeColumns({ includeHeaders:false });
      });
    }, 1000);
    return () => {
      clearInterval(timeoutId);
    };
  }, [data, apiRef]);

  return (
    <Card>
      <CardContent>
        <Box>
          <TranscriptionInfo transcriber={transcriptionInfo.transcriber} complete={transcriptionInfo.complete} flipComplete={flipComplete}/>
          <DataGrid
            loading={loading}
            apiRef={apiRef}
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
            pageSizeOptions={[20]}
            disableColumnSorting
            disableColumnMenu
            columnGroupingModel={columnGroupingModel}
            autosizeOnMount
            autosizeOptions={{
              includeHeaders: false,
            }}
            getRowHeight={()=>'auto'}
            columnHeaderHeight={28}
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
