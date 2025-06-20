import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import { GridColDef, GridColumnGroupingModel, gridClasses } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import DataTable from './datatable';

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

export function TranscriptionInfo({transcriber, complete, flipComplete, disabled}) {
  return (
    <Stack direction='row' spacing={4} alignItems='center'>
      <Typography>Transcriber: {transcriber}</Typography>
      <FormControlLabel control={<Checkbox checked={complete} onChange={flipComplete} disabled={disabled}/>} label='Complete' labelPlacement='start'/>
    </Stack>
  );
}

export default function ServiceTable({transcriber, complete, cloneButton, flipComplete, data, onChange, difference, extraRowControls, primary}) {
  const loading = useContext(LoadingContext);

  const columns: GridColDef[] = [
    {
      field: primary,
      headerName: '#',
      width: 40,
      minWidth: 40,
      align: 'right',
    },
    {
      field: 'ship',
      headerName: 'Ship',
      flex: 20,
      editable: true,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 8,
      editable: true,
    },
    {
      field: 'fromday',
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'frommonth',
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'fromyear',
      headerName: 'Y',
      flex: 6,
      editable: true,
    },
    {
      field: 'today',
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'tomonth',
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'toyear',
      headerName: 'Y',
      flex: 6,
      editable: true,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{width: '70em'}}>
          <Stack direction='row' justifyContent='space-between'>
            <TranscriptionInfo transcriber={transcriber} complete={complete} flipComplete={flipComplete} disabled={loading}/>
            {cloneButton}
          </Stack>
          <DataTable
            rows={data}
            columns={columns}
            columnGroupingModel={columnGroupingModel}
            onChange={onChange}
            primary={primary}
            positionalPrimary
            extraRowControls={extraRowControls}
            getCellClassName={(p) => {
              if (difference !== null) {
                if(p.id > difference.length) {
                  return 'differs';
                }
                else if(p.field in difference[p.id - 1]) {
                  return 'differs';
                }
              }
            }}
            sx={{
              [`.${gridClasses.cell}.differs`]: {
                backgroundColor: '#ff943975',
                color: '#1a3e72',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
