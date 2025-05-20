import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Card, CardContent, CircularProgress, Link, Stack, Typography, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from '@mui/material';
import { ElectricBolt } from '@mui/icons-material';
import { pieceQuery } from './queries';
import RatingsIndexNavigator from './ratingsindexnavigator';

const NOT_WW1     =  1;
const ALLOCATED_1 =  2;
const ALLOCATED_2 =  4;
const COMPLETED_1 =  8;
const COMPLETED_2 = 16;
const XCHECKED    = 32;
const MISSING     = 64;

const SQUARE_SIZE = 20;

function color(set, state) {
  if(state & XCHECKED)    return 'lightgreen';
  if(state & MISSING) return 'red';
  if(set === 1) {
    if(state & COMPLETED_1) return 'yellow';
    if(state & ALLOCATED_1) return 'pink';
    return 'white';
  }
  if(set === 2) {
    if(state & COMPLETED_2) return 'yellow';
    if(state & ALLOCATED_2) return 'pink';
    return 'white';
  }
  return 'white';
}

function triangle1(pos, state) {
  return(
    <polygon points={`${pos * SQUARE_SIZE},0 ${pos * SQUARE_SIZE + SQUARE_SIZE},0 ${pos * SQUARE_SIZE},${SQUARE_SIZE}`}
             fill={color(1, state)} stroke={color(1, state) === color(2, state) ? color(1, state) : 'black'}/>
  );
}

function triangle2(pos, state) {
  return(
    <polygon points={`${pos * SQUARE_SIZE + SQUARE_SIZE},0 ${pos * SQUARE_SIZE + SQUARE_SIZE},${SQUARE_SIZE} ${pos * SQUARE_SIZE},${SQUARE_SIZE}`}
             fill={color(2, state)} stroke={color(1, state) === color(2, state) ? color(1, state) : 'black'}/>
  );
}

function dot(pos) {
  return(
    <circle cx={pos * SQUARE_SIZE + 0.5 * SQUARE_SIZE} cy={0.5 * SQUARE_SIZE} r={0.2 * SQUARE_SIZE}/>
  );
}

function box(pos) {
  return (
    <rect x={pos * SQUARE_SIZE}
          y={0}
          width={SQUARE_SIZE}
          height={SQUARE_SIZE}
          stroke='black'
          strokeWidth={2}
          fill='none'
    />
  );
}

function key() {
  function keyItem(thing, label) {
    return(
      <Stack direction='row' spacing={1}>
        <svg  sx={{minWidth: SQUARE_SIZE * 2}} width={SQUARE_SIZE} height={SQUARE_SIZE}>
          {thing}
          {box(0)}
        </svg>
        <Typography>{label}</Typography>
      </Stack>
    );
  }

  function squareThing(state1, state2) {
    return(
      <>
        {triangle1(0, state1 | state2)}
        {triangle2(0, state1 | state2)}
      </>
    );
  }

  return(
    <Stack direction='row' spacing={6}>
      <Stack spacing={1}>
        {keyItem(squareThing(ALLOCATED_1, ALLOCATED_2), 'Both allocated')}
        {keyItem(triangle1(0, ALLOCATED_1), 'Set 1 allocated')}
        {keyItem(triangle2(0, ALLOCATED_2), 'Set 2 allocated')}
      </Stack>
      <Stack spacing={1}>
        {keyItem(squareThing(COMPLETED_1, COMPLETED_2), 'Both completed')}
        {keyItem(triangle1(0, COMPLETED_1), 'Set 1 completed')}
        {keyItem(triangle2(0, COMPLETED_2), 'Set 2 completed')}
      </Stack>
      <Stack spacing={1}>
        {keyItem(squareThing(XCHECKED, XCHECKED), 'Cross-checked')}
        {keyItem(squareThing(MISSING, MISSING), 'Mising/not used')}
        {keyItem(dot(0), 'Not WW1')}
      </Stack>
    </Stack>
  );
}

//TODO: The Tooltip and Link returned here end up inside an <svg> tag -- is that OK?
function statusRow(data) {
  const states = [];
  for(let i = 0; i < data.value.length; i++) {
    const state = data.value[i];
    const identifier = data.row.nameid + i;
    states.push(
      <Tooltip key={'tt_' + identifier} title={identifier}>
        <Link href={process.env.PUBLIC_URL + '/rating/' + identifier}
              onClick={(e) => { (state & MISSING) && e.preventDefault(); }}
        >
          {triangle1(i, state)}
          {triangle2(i, state)}
          {(state & NOT_WW1) && dot(i)}
          {box(i)}
        </Link>
      </Tooltip>
    );
  }

  return(
    <Stack direction='row' spacing={0}><svg style={{height: SQUARE_SIZE, width: SQUARE_SIZE * data.value.length}}>{states}</svg></Stack>
  );
}

function chunk(data, rowLength) {
  const output = [];
  for(let i = 0; i < data.length; i += rowLength) {
    const chunk = data.slice(i, i + rowLength);
    output.push({
      nameid: Number(chunk[0].nameid),
      range: chunk[0].nameid + ' - ' + chunk[chunk.length - 1].nameid,
      state: chunk.map((x)=>x.state),
      statecount: chunk.length,
    });
  }
  return output;
}

export default function RatingsIndex() {
  const { piece } = useParams();
  const { data, status } = useQuery({...pieceQuery(piece), select: (x) => ({
    ranges: x.piece_ranges,
    states: x.records.map((record) => {
      let state = 0;
      if(record.notww1 === null && record.has_tr1 === null && record.has_tr2 === null && record.complete1 === null && record.complete2 === null && record.reconciled === null) {
        state = 64;
      }
      else {
        if(record.notww1)     state |=  1;
        if(record.has_tr1)    state |=  2;
        if(record.has_tr2)    state |=  4;
        if(record.complete1)  state |=  8;
        if(record.complete2)  state |= 16;
        if(record.reconciled) state |= 32;
      }
      return {
        nameid: record.nameid,
        state: state,
      };
    }),
  })});
  const [ rowLength, setRowLength ] = useState(20);

  if(status === 'error') {
    return(<Alert severity='error'>Error fetching data</Alert>);
  }
  if(status === 'pending') {
    return(<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }

  const unreconciled = [];
  for(const state of data.states) {
    if((state.state & (XCHECKED|MISSING)) === 0) {
      unreconciled.push(state.nameid);
    }
  }

  const chunks = chunk(data.states, rowLength);

  document.title = 'Ratings Progress';

  const columns: GridColDef[] = [
    {
      field: 'range',
      headerName: 'Range',
      width: 160,
      align: 'right',
    },
    {
      field: 'state',
      headerName: 'State',
      width: SQUARE_SIZE * rowLength + SQUARE_SIZE,
      align: 'left',
      renderCell: statusRow,
    },
    {
      field: 'statecount',
      headerName: '',
      width: 50,
      align: 'right',
    },
  ];

  return (
    <Card>
      <CardContent>
        {/* outermost stack: progress view on left, key on right */}
        <Stack direction='row' spacing={8}>
          {/* progress view */}
          <Stack spacing={2}>
            {/* progress view header (catref, width controls) */}
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              {/* catref control */}
              <RatingsIndexNavigator/>
              {/* Right-side controls */}
              <Stack direction='row' spacing={2}>
                <FormControl>
                  <InputLabel>Width</InputLabel>
                  <Select size='small' label='Width' value={rowLength} onChange={(e, v) => {setRowLength(v.props.value);}}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip title='Next un-cross-checked record'>
                  {/* div needed for tooltip to work when button is disabled */}
                  <div>
                    <IconButton color='primary'
                                disabled={unreconciled.length === 0}
                                href={process.env.PUBLIC_URL + '/rating/' + unreconciled[0]}
                    >
                      <ElectricBolt/>
                    </IconButton>
                  </div>
                </Tooltip>
              </Stack>
            </Stack>
            <DataGrid
              density='compact'
              getRowId={(row) => {return row.nameid}}
              rows={chunks}
              columns={columns}
              disableColumnSorting
              disableColumnMenu
              disableRowSelectionOnClick
              getRowHeight={()=>'auto'}
            />
          </Stack>
          {/* this stack covers the whole right-hand column */}
          <Stack spacing={2}>
            {/* this stack appears just at the top of right-hand column */}
            <Stack spacing={2} alignItems='flex-start' justifyContent='flex-start' sx={{border: 1, px: 2, py: 1}}>
              <Typography><b>Key</b></Typography>
              {key()}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
