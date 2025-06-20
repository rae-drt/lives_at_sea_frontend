import { useParams, useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Card, CardContent, Stack, Typography, Tooltip, IconButton } from '@mui/material';
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

const SQUARE_SIZE = 30;
const SQUARE_GAP = 0.15;

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

function rowWidth(rowBoxes) {
  const gapSum = Math.max(0, SQUARE_SIZE * SQUARE_GAP * (rowBoxes / 5 - 1));
  const squareSum = SQUARE_SIZE * (rowBoxes + 1);
  return gapSum + squareSum + 1; // +1 to cover possibility of rounding errors
}

//TODO: The Tooltip and Link returned here end up inside an <svg> tag -- is that OK?
function statusRow(data) {
  const states = [];
  let offset = -1 - SQUARE_GAP;
  for(let i = 0; i < data.value.length; i++) {
    const state = data.value[i];
    const identifier = data.row.nameid + i;
    offset += 1;
    if(i % 5 === 0) offset += SQUARE_GAP;
    states.push(
      <Tooltip key={'tt_' + identifier} title={identifier}>
        <Link to={(state & MISSING) ? '#' : '/rating/' + identifier}>
          {triangle1(offset, state)}
          {triangle2(offset, state)}
          {(state & NOT_WW1) && dot(offset)}
          {box(offset)}
        </Link>
      </Tooltip>
    );
  }

  return(
    <Stack direction='row' spacing={0}><svg style={{height: SQUARE_SIZE, width: rowWidth(data.value.length - 1)}}>{states}</svg></Stack>
  );
}

function chunk(data, rowBoxes) {
  const { states, ranges } = data;
  const output = [];
  for(let i = 0; i < states.length; i += rowBoxes) {
    const chunk = states.slice(i, i + rowBoxes);
    output.push({
      nameid: Number(chunk[0].nameid),
      range: chunk[0].nameid + ' - ' + chunk[chunk.length - 1].nameid,
      state: chunk.map((x)=>x.state),
    });
  }

  // Handle the case where the next piece has items that start more than one nameId after this one ends
  // In this case, we append missing items to the current piece.
  // TODO: Check this one with Bruno
  //       But, does it ever come up in practice?
  //       We know it happens between pieces 88 and 89, but they are not actually in the database (but,
  //       this code will come into play if we force the piece to load by putting 88 into the URL)
  const thisEnd = ranges.this_piece.end_item;
  const nextStart = ranges.next_piece.start_item;
  const lastOutput = output[output.length - 1];

  //extend the last row that we already have, if necessary
  const filler = Array(Math.min(rowBoxes - lastOutput.state.length, nextStart - thisEnd - 1)).fill(MISSING, 0);
  if(filler.length) {
    lastOutput.state.push(...filler);
    lastOutput.range = lastOutput.nameid + ' - ' + (lastOutput.nameid + lastOutput.state.length - 1);
  }

  //add as many new rows as we need to end up with an item numbered one below the lowest item of the next piece
  for(let i = thisEnd + filler.length + 1; i < nextStart; i += rowBoxes) {
    const start = i;
    const end = Math.min(i + rowBoxes - 1, ranges.next_piece.start_item - 1);
    output.push({
      nameid: i,
      range: i + ' - ' + end,
      state: Array(end - start + 1).fill(MISSING, 0),
    });
  }

  return output;
}

export default function RatingsIndex() {
  const { piece } = useParams();
  const [ searchParams, ] = useSearchParams({rowBoxes: 30});
  const { data: queryData, status: queryStatus } = useQuery({...pieceQuery(piece), select: (x) => ({
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

  document.title = 'Ratings Progress: ADM 188/' + piece;

  if(queryStatus === 'error') {
    return(<Alert severity='error'>Error fetching data</Alert>);
  }

  const unreconciled = [];
  const chunks = queryStatus === 'success' ? chunk(queryData, Number(searchParams.get('rowBoxes'))) : [];
  if(queryStatus === 'success') {
    for(const state of queryData.states) {
      if((state.state & (XCHECKED|MISSING)) === 0) {
        unreconciled.push(state.nameid);
      }
    }
  }

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
      width: rowWidth(Number(searchParams.get('rowBoxes'))),
      align: 'left',
      renderCell: statusRow,
    },
  ];
  const PAGE_ROWS = 100;

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
              loading={queryStatus !== 'success'}
              density='compact'
              sx={{width: columns.reduce((acc, cur)=>(acc += cur.width), 1 + SQUARE_SIZE/10 /*needs this small increment to avoid horizontal scrollbar*/)}}
              getRowId={(row) => {return row.nameid}}
              rows={chunks}
              columns={columns}
              disableColumnSorting
              disableColumnMenu
              disableRowSelectionOnClick
              pageSizeOptions={[PAGE_ROWS]}
              getRowHeight={()=>(SQUARE_SIZE + SQUARE_GAP + 2)}
              hideFooter={chunks.length <= PAGE_ROWS}
              localeText={{
                MuiTablePagination: {
                  labelDisplayedRows: ({ from, to, count, page }) => {
                    const highPage = Math.ceil(count / 100);
                    if(highPage) return `Page ${highPage ? page + 1 : 0}/${highPage}`;
                    else return '';
                  }
                },
              }}
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
