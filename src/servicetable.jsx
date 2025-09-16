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
import { SERVICE_FIELD_VALIDATORS, get_datevalidator } from './data_utils';

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

function impossibleServiceDates({fromday, frommonth, fromyear, tomonth, today, toyear}) {
  if(toyear === 0 || fromyear === 0 || toyear === null || fromyear === null) return false; //if we do not know one of the years, we cannot know if "to" is earlier than "from"
  if(toyear > fromyear) return false;
  if(toyear < fromyear) return true;

  //years are both known and equal, try months
  if(tomonth === 0 || frommonth === 0 || toyear === null || fromyear === null) return false; //if we do not know one of the months, we cannot know if "to" is earlier than "from"
  if(tomonth > frommonth) return false;
  if(tomonth < frommonth) return true;

  //months and years are all known and all equal, try days
  if(today === 0 || fromday === 0 || today === null || fromyear === null) return false; //if we do not know one of the days, we cannot know if "to" is earlier than "from"
  if(today < fromday) return true;
  return false; //today is at least as high as fromday
}

export function TranscriptionInfo({transcriber, complete, flipComplete, disabled}) {
  return (
    <Stack direction='row' spacing={4} alignItems='center'>
      <Typography>Transcriber: {transcriber}</Typography>
      <FormControlLabel control={<Checkbox checked={complete} onChange={flipComplete} disabled={disabled}/>} label='Complete' labelPlacement='start'/>
    </Stack>
  );
}

export default function ServiceTable({transcriber, complete, reconciled, cloneButton, flipComplete, data, onChange, difference, controlCount, extraRowControls, primary}) {
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
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
        <Box sx={{width: extraRowControls ? '45vw' : '90vw'}}>
          <Stack direction='row' justifyContent='space-between'>
            <TranscriptionInfo transcriber={transcriber} complete={complete} flipComplete={flipComplete} disabled={loading || reconciled}/>
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
            getCellClassName={({field, id, value, row}) => {
              if(field === primary || field === 'row_controls') { //these two fields do not need decoration
                return;
              }
              const differs = (difference !== null) && (id > difference.length || field in difference[id - 1]);

              let errs = !(SERVICE_FIELD_VALIDATORS[field](value));
              if(!errs) {
                for(const date of [['fromday', 'frommonth', 'fromyear'], ['today', 'tomonth', 'toyear']]) {
                  if(date.includes(field)) {
                    errs = (get_datevalidator({day: date[0], month: date[1], year: date[2]})(row)).includes(field);
                  }
                }
              }
              if(!errs) {
                if(['fromday', 'frommonth', 'fromyear', 'today', 'tomonth', 'toyear'].includes(field)) {
                  if(impossibleServiceDates(row)) errs = true;
                }
              }
              if(differs && errs) return 'errdiffers';
              else if(differs)    return    'differs';
              else if(errs)       return 'error';
            }}
            sx={{
              [`& .${gridClasses.cell}.differs`]: style.differentCell,
              [`& .${gridClasses.cell}.errdiffers`]: {...(style.differentCell), ...(style.errorCell)},
            }}
            controlCount={controlCount}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
