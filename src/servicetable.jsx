import { useContext } from 'react';
import { LoadingContext } from './loadingcontext';

import style from './style';

import { gridClasses } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';

import { DataTable } from './datatable';

const columnGroupingModel = [
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

export default function ServiceTable({transcriber, complete, cloneButton, flipComplete, data, onChange, difference, controlCount, extraRowControls, primary}) {
  const loading = useContext(LoadingContext);
  const theme = useTheme();
  const columns = [
    {
      field: primary,
      headerName: '#',
      //width: 3 * theme.typography.fontSize,
      flex: 1,
      minWidth: 3 * theme.typography.fontSize,
      align: 'right',
    },
    {
      field: 'ship',
      headerName: 'Ship',
      flex: 8,
      //width: 15 * theme.typography.fontsize,
      editable: true,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 4,
      //width: 6 * theme.typography.fontSize,
      editable: true,
    },
    {
      field: 'fromday',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'D',
      flex: 1,
      minWidth: 2.5 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
    {
      field: 'frommonth',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'M',
      flex: 1,
      minWidth: 2.5 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
    {
      field: 'fromyear',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'Y',
      flex: 2,
      minWidth: 4 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
    {
      field: 'today',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'D',
      flex: 1,
      minWidth: 2.5 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
    {
      field: 'tomonth',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'M',
      flex: 1,
      minWidth: 2.5 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
    {
      field: 'toyear',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      headerName: 'Y',
      flex: 2,
      minWidth: 4 * theme.typography.fontSize,
      align: 'right',
      editable: true,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{width: '45vw'}}>
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
            sx={{ [`.${gridClasses.cell}.differs`]: style.differentCell }}
            controlCount={controlCount}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
