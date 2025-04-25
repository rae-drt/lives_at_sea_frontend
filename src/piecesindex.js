import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link, Stack, Tooltip } from '@mui/material'

//const MIN_WIDTH=10;
const X_FACTOR = 2.5 * 500; //if items.length is 500, we get a width of 2.5 per point of value. So width-per-point varies slightly, depending on number of items in piece, so that all progress bars can be the same total length.
const Y_SIDE = 20;
const STATES = ['notWW1', 'reconciled', 'bothComplete', 'oneComplete', 'bothAssigned', 'oneAssigned', 'unAssigned'];
const COLORS = {
  notWW1: '',
  reconciled: 'lightgreen',
  bothComplete: 'yellow',
  oneComplete: 'goldenrod',
  bothAssigned: 'pink',
  oneAssigned: 'palevioletred',
  unAssigned: 'white'
};

function stringify(x, length) {
  let y = ' ';
  for(const key in x) {
    y += key + '=' + x[key] + '/' + length + ' (' + Number.parseInt((100 * x[key])/length) + '%) ';
  }
  return y;
}

/* TODO: Hopefully the API can do the aggregation for me: ideally one call gives me an array of aggregration-per-piece for the whole series */
function PieceSummary({series, piece}) {
  const [ items, setItems ] = useState([]);
  const [ aggregation, setAggregation ] = useState({ bothAssigned: 0, oneAssigned: 0, unAssigned: 0, bothComplete: 0, oneComplete: 0, unComplete: 0, reconciled: 0, notWW1: 0 });
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setItems([]);
        }
        else {
          setItems(JSON.parse(e.data));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:Ratings:' + series + ':' + piece) };
    }
    fetchData();
  },[series, piece]);
  useEffect(() => {
    setAggregation(items.reduce((acc, current) => {
      const x = structuredClone(acc);

      if(current.notWW1) x.notWW1 += 1;

      if(current.reconciled) x.reconciled += 1;
      else if(current.complete1 && current.complete2) x.bothComplete += 1;
      else if(current.complete1 || current.complete2) x.oneComplete += 1;
      else if(current.tr1id && current.tr2id)         x.bothAssigned += 1;
      else if(current.tr1id || current.tr2id)         x.oneAssigned += 1;
      else                                            x.unAssigned += 1;

      return x;
    }, { unAssigned: 0, bothAssigned: 0, oneAssigned: 0, bothComplete: 0, oneComplete: 0, reconciled: 0, notWW1: 0 }));
  }, [items]);
  
  function rectangle(start, value, color) {
    //console.log(start, value, color);
    if(items && items.length) {
      return (
        <rect 
          x={start * X_FACTOR / items.length}
          y={0}
          width={value * X_FACTOR / items.length}
          height={Y_SIDE}
          stroke='black'
          strokeWidth={1}
          fill={color}
        />
      );
    }
    else return null;
  }

  return(
    <Stack width={1}>
      <Tooltip title={stringify(aggregation, items.length)}>
        <Link href={process.env.PUBLIC_URL + '/ratings/' + series + '/' + piece}>
          <Stack direction='row'>
            {piece}
            <svg style={{width: 1500, height: Y_SIDE}}>
              {
                ['reconciled', 'bothComplete', 'oneComplete', 'bothAssigned', 'oneAssigned', 'unAssigned'].map((e, i, a) => (
                  <Tooltip key={i} title={e + ': ' + aggregation[e]}>
                    {rectangle(i === 0 ? 1 : a.slice(0, i).reduce((a, b)=>(a + aggregation[b]), 1), aggregation[e], COLORS[e])}
                  </Tooltip>
                ))
              }
            </svg>
          </Stack>
        </Link>
      </Tooltip>
    </Stack>
  );
}

export default function PieceIndex() {
  const { series } = useParams();
  const [ pieces, setPieces ] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setPieces([]);
        }
        else {
          setPieces(JSON.parse(e.data));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:Pieces:' + series) };
    }
    fetchData();
  },[series]);

  return(
    <Stack>
      {/* TODO: The websocket daemon cannot handle all these requests landing at once, hence the slice. Would make more sense to aggregate on the server side.*/pieces.slice(180, 210).map((piece) => (<PieceSummary key={series + '_' + piece} series={series} piece={piece}/>))}
    </Stack>
  );
}
