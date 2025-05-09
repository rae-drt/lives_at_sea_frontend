import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Link, Stack, Typography, FormControl, InputLabel, Select, MenuItem, Tooltip, TextField, Autocomplete, IconButton } from '@mui/material';
import { ArrowForwardIos, ElectricBolt } from '@mui/icons-material';

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
              onClick={(e) => { (state & MISSING) && e.preventDefault(); }}
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
      consecutived_data.push({nameid: lastNo, state: MISSING});
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

function seriesQF({queryKey}) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onerror = (e) => { reject(e); };
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        resolve([]);
      }
      else {
        resolve(JSON.parse(e.data));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:Serieses') };
  });
}

function piecesQF({queryKey}) {
  const [, series] = queryKey;
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onerror = (e) => { reject(e); };
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        resolve([]);
      }
      else {
        resolve(JSON.parse(e.data));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:Pieces:' + series) };
  });
}

export default function RatingsIndex() {
  const { series, piece } = useParams();
  const { data: seriesesData, status: seriesesStatus } = useQuery({
    queryKey: ['serieses'],
    queryFn: seriesQF,
    staleTime: 5000,
    initialData: [188],
  });
  const { data: piecesData, status: piecesStatus } = useQuery({
    queryKey: ['pieces', series],
    queryFn: piecesQF,
    staleTime: Infinity,
    initialData: [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,988,989,990,991,992,993,994,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040,1041,1042,1043,1044,1045,1046,1047,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1094],
  });
  const [ data, setData ] = useState([]);
  const [ unreconciled, setUnreconciled ] = useState([]);
  const [ chunks, setChunks ] = useState();
  const [ rowLength, setRowLength ] = useState(20);
  const navigate = useNavigate();
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
    }
    fetchData();
  },[series, piece]);
  useEffect(() => {
    setChunks(chunk(data, rowLength));
  },[data, rowLength]);
  useEffect(() => {
    const x = [];
    for(const datum of data) {
      if((datum.state & XCHECKED) === 0 && (!(datum.state & MISSING))) {
        x.push(datum.nameid);
      }
    }
    setUnreconciled(x);
  },[data]);

  async function changeSeries(series) {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        setData([]);
      }
      else {
        const d = JSON.parse(e.data);
        navigate(process.env.PUBLIC_URL + '/ratings/' + series + '/' + d[0]);
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:Pieces:' + series) };
  }

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
              <Stack direction='row' spacing={2} alignItems='center' width={0.6}>
                <Typography variant='h6'>ADM</Typography>
                <Autocomplete size='small'
                              disableClearable
                              autoHighlight
                              options={seriesesData.map((x)=>({label: '' + x}))}
                              renderInput={(params) => <TextField {...params} label="Series"/>}
                              value={series}
                              onChange={(e, v, r)=>{
                                if(r === 'selectOption') {
                                  changeSeries(v.label);
                                }
                              }}
                />
                <Typography variant='h6'>/</Typography>
                <Autocomplete size='small'
                              fullWidth
                              disableClearable
                              autoHighlight
                              options={piecesData.map((x)=>({label: '' + x}))}
                              renderInput={(params) => <TextField {...params} label="Piece"/>}
                              value={piece}
                              onChange={(e, v, r)=>{if(r === 'selectOption') navigate(process.env.PUBLIC_URL + '/ratings/' + series + '/' + v.label)}}
                />
                {/* Nav forward, backward buttons */}
                <Stack direction='row' spacing={0}>
                  <Tooltip title='Back one piece'>
                    <div>
                      <IconButton
                        disabled={piecesData[0] === Number(piece)}
                        href={process.env.PUBLIC_URL + '/ratings/' + series + '/' + (piecesData[piecesData.indexOf(Number(piece)) - 1])}
                      >
                        <ArrowForwardIos color='primary' sx={{transform: 'rotate(180deg)'}}/>
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip title='Forward one piece'>
                    <div>
                      <IconButton
                        disabled={piecesData.at(-1) === Number(piece)}
                        href={process.env.PUBLIC_URL + '/ratings/' + series + '/' + (piecesData[piecesData.indexOf(Number(piece)) + 1])}
                      >
                        <ArrowForwardIos color='primary'/>
                      </IconButton>
                    </div>
                  </Tooltip>
                </Stack>
              </Stack>
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
