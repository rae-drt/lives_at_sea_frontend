import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Link, Stack, Typography } from '@mui/material';

const NOT_WW1     =  1;
const ALLOCATED_1 =  2;
const ALLOCATED_2 =  4;
const COMPLETED_1 =  8;
const COMPLETED_2 = 16;
const XCHECKED    = 32;

const RECORDS_PER_ROW = 10;
const SQUARE_SIZE = 20;

function color(set, state) {
  if(state & XCHECKED)    return 'lightgreen';
  if(set === 1) {
    if(state & COMPLETED_1) return 'yellow';
    if(state & ALLOCATED_1) return 'pink';
  }
  if(set === 2) {
    if(state & COMPLETED_2) return 'yellow';
    if(state & ALLOCATED_2) return 'pink';
  }
  return 'red';
}

function triangle1(pos, state) {
  return(
    <polygon points={`${pos * SQUARE_SIZE},0 ${pos * SQUARE_SIZE + SQUARE_SIZE},0 ${pos * SQUARE_SIZE},${SQUARE_SIZE}`}
             fill={color(1, state)} stroke='none'/>
  );
}

function triangle2(pos, state) {
  return(
    <polygon points={`${pos * SQUARE_SIZE + SQUARE_SIZE},0 ${pos * SQUARE_SIZE + SQUARE_SIZE},${SQUARE_SIZE} ${pos * SQUARE_SIZE},${SQUARE_SIZE}`}
             fill={color(2, state)} stroke='none'/>
  );
}

function cross(pos) {
  return(
    <>
      <line x1={pos * SQUARE_SIZE} x2={pos * SQUARE_SIZE + SQUARE_SIZE} y1={0} y2={SQUARE_SIZE} stroke='black' strokeWidth={1}/>
      <line x1={pos * SQUARE_SIZE} x2={pos * SQUARE_SIZE + SQUARE_SIZE} y1={SQUARE_SIZE} y2={0} stroke='black' strokeWidth={1}/>
    </>
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

  function triangleThing(thing) {
    return(
      <>
        {thing}
        <line x1={0} x2={SQUARE_SIZE} y1={SQUARE_SIZE} y2={0} stroke='black' strokeWidth={1}/>
      </>
    );
  }
  
  function squareThing(state1, state2) {
    return(
      <>
        {triangle1(0, state1)}
        {triangle2(0, state2)}
      </>
    );
  }

  return(
    <Stack direction='row' spacing={6}>
      <Stack spacing={1}>
        {keyItem(squareThing(ALLOCATED_1, ALLOCATED_2), 'Both allocated')}
        {keyItem(triangleThing(triangle1(0, ALLOCATED_1)), 'Set 1 allocated')}
        {keyItem(triangleThing(triangle2(0, ALLOCATED_2)), 'Set 2 allocated')}
      </Stack>
      <Stack spacing={1}>
        {keyItem(squareThing(COMPLETED_1, COMPLETED_2), 'Both completed')}
        {keyItem(triangleThing(triangle1(0, COMPLETED_1)), 'Set 1 completed')}
        {keyItem(triangleThing(triangle2(0, COMPLETED_2)), 'Set 2 completed')}
      </Stack>
      <Stack spacing={1}>
        {keyItem(squareThing(XCHECKED, XCHECKED), 'Cross-checked')}
        {keyItem(squareThing(0, 0), 'Mising/not used')}
        {keyItem(cross(0), 'Not WW1')}
      </Stack>
    </Stack>
  );
}

//TODO: The Link returned here ends up inside an <svg> tag -- is that OK?
function statusRow(data) {
  const states = [];
  for(let i = 0; i < data.value.length; i++) {
    const state = data.value[i];
    const identifier = Number(data.row.from) + i;
    states.push(
      <Link key={'link_' + identifier} href={process.env.PUBLIC_URL + '/rating/' + identifier}>
        {triangle1(i, state)}
        {triangle2(i, state)}
        {(state & NOT_WW1) && cross(i)}
        {box(i)}
      </Link>
    );
  }

  return(
    <Stack direction='row' spacing={0}><svg style={{height: SQUARE_SIZE, width: SQUARE_SIZE * RECORDS_PER_ROW}}>{states}</svg></Stack>
  );
}

function computeData(data) {
  const output = [];
  function getStatusReducer(keys) {
    return (acc, current) => {
      let result = current.notWW1 ? 1 : 0;
      for(const key of Object.keys(keys)) {
        if(current[key]) result = result | keys[key];
      }
      return [...acc, result];
    }
  }
  for(let i = 0; i < data.length; i += RECORDS_PER_ROW) {
    const chunk = data.slice(i, i + RECORDS_PER_ROW);
    output.push({
      from: chunk[0].officialnumber,
      to:   chunk[chunk.length - 1].officialnumber,
      state: chunk.reduce(getStatusReducer({
        tr1id: ALLOCATED_1,
        complete1: COMPLETED_1,
        tr2id: ALLOCATED_2,
        complete2: COMPLETED_2,
        reconciled: XCHECKED}),
      []),
      statecount: chunk.length,
    });
  }
  return output;
}

export default function RatingsIndex() {
  const { series, piece } = useParams();
  const [ chunks, setChunks ] = useState();
  useEffect(() => {
    const fetchData = async() => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        setChunks([]);
      }
      else {
        setChunks(computeData(JSON.parse(e.data)));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:Ratings:' + series + ':' + piece) };
  };
  fetchData();},[series, piece]);

  document.title = 'Ratings Progress';

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: 'officialnumberrange',
      headerName: 'Official Number',
      children: [ { field: 'from' }, { field: 'to' }, ],
    },
  ]

  const columns: GridColDef[] = [
    {
      field: 'from',
      headerName: 'From',
      width: 80,
      align: 'right',
    },
    {
      field: 'to',
      headerName: 'To',
      width: 80,
      align: 'right',
    },
    {
      field: 'state',
      headerName: 'State',
      width: SQUARE_SIZE * RECORDS_PER_ROW + SQUARE_SIZE, //add a SQUARE_SIZE for a bit of space
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
        <Stack alignItems='flex-start' spacing={2}>
          <Typography variant='h6'>ADM {series}/{piece}</Typography>
          <Stack direction='row' spacing={8}>
            <DataGrid
              density='compact'
              getRowId = {(row) => {return row.from;}}
              rows={chunks}
              columns={columns}
              columnGroupingModel={columnGroupingModel}
              disableColumnSorting
              disableColumnMenu
              getRowHeight={()=>'auto'}
            />
            <Stack>
              <Stack spacing={2} alignItems='flex-start' justifyContent='flex-start' sx={{border: 1, px: 2, py: 1}}>
                <Typography><b>Key</b></Typography>
                {key()}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
