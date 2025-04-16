import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Link, Stack, Typography, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';

const NOT_WW1     =  1;
const ALLOCATED_1 =  2;
const ALLOCATED_2 =  4;
const COMPLETED_1 =  8;
const COMPLETED_2 = 16;
const XCHECKED    = 32;

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

//TODO: The Tooltip and Link returned here end up inside an <svg> tag -- is that OK?
function statusRow(data) {
  const states = [];
  for(let i = 0; i < data.value.length; i++) {
    const state = data.value[i];
    const identifier = data.row.nameid + i;
    states.push(
      <Tooltip key={'tt_' + identifier} title={identifier}>
        <Link href={process.env.PUBLIC_URL + '/rating/' + identifier}
              onClick={(e) => { (color(1, state) === 'red' || color(2, state) === 'red') && e.preventDefault(); }}
        >
          {triangle1(i, state)}
          {triangle2(i, state)}
          {(state & NOT_WW1) && cross(i)}
          {box(i)}
        </Link>
      </Tooltip>
    );
  }

  return(
    <Stack direction='row' spacing={0}><svg style={{height: SQUARE_SIZE, width: SQUARE_SIZE * data.value.length}}>{states}</svg></Stack>
  );
}

function computeData(data) {
  function state(x) {
    let state = x.notWW1 ? 1 : 0;
    if(x.tr1id)      state |= ALLOCATED_1;
    if(x.complete1)  state |= COMPLETED_1;
    if(x.tr2id)      state |= ALLOCATED_2;
    if(x.complete2)  state |= COMPLETED_2;
    if(x.reconciled) state |= XCHECKED;
    return state;
  }

  /* Ensure that nameids are consecutive by filling in any gaps with an object containing only the
   * appropriate nameid.
   * Assumes that nameids are ascending within a series, and checks for this.
   * Assumes that the API returns the data ordered by official number
   ** TODO: Ask Mark to arrange the API like this.
   */
  const consecutived_data = [{
    nameid: data[0].nameid,
    state: state(data[0]),
  }];
  let lastNo = data[0].nameid;
  for(const datum of data.slice(1)) {
    const nextNo = datum.nameid;
    if(nextNo <= lastNo) {
      throw new Error('Nameids are not ascending (' + nextNo + ' <= ' + lastNo);
    }
    while(nextNo > lastNo + 1) {
      lastNo += 1;
      consecutived_data.push({nameid: lastNo});
    }
    lastNo += 1;
    consecutived_data.push({nameid: lastNo, state: state(datum)});
  }

  return consecutived_data;
}

function chunk(data, rowLength) {
  if(!data) { return []; }

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
  const { series, piece } = useParams();
  const [ data, setData ] = useState();
  const [ chunks, setChunks ] = useState();
  const [ rowLength, setRowLength ] = useState(20);
  useEffect(() => {
    const fetchData = async() => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        setData([]);
      }
      else {
        setData(computeData(JSON.parse(e.data)));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:Ratings:' + series + ':' + piece) };
  };
  fetchData();},[series, piece]);
  useEffect(() => {
    setChunks(chunk(data, rowLength));
  },[data, rowLength]);

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
      width: SQUARE_SIZE * rowLength + SQUARE_SIZE, //add a SQUARE_SIZE for a bit of space
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
              getRowId={(row) => {return row.nameid}}
              rows={chunks}
              columns={columns}
              disableColumnSorting
              disableColumnMenu
              disableRowSelectionOnClick
              getRowHeight={()=>'auto'}
            />
            <Stack spacing={2}>
              <Stack spacing={2} alignItems='flex-start' justifyContent='flex-start' sx={{border: 1, px: 2, py: 1}}>
                <Typography><b>Key</b></Typography>
                {key()}
              </Stack>
              <Stack width='0.2'>
                <FormControl>
                  <InputLabel>Width</InputLabel>
                  <Select label='Width' value={rowLength} onChange={(e, v) => {setRowLength(v.props.value);}}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
