import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, CircularProgress, Stack, Snackbar, Typography, Tooltip, TextField, Autocomplete, IconButton } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { piecesQuery } from './queries';
import { range } from 'lodash';
import { getSkippedStr } from './data_utils';

export default function RatingsIndexNavigator() {
  const { piece } = useParams();
  const { data: pieces, status: queryStatus } = useQuery(piecesQuery);
  const [skipped, setSkipped] = useState([]);
  const navigate = useNavigate();

  if(queryStatus === 'error') {
    return(<Alert severity='error'>Error fetching data</Alert>);
  }
  if(queryStatus === 'pending') {
    return(<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }

  if((!Number.isSafeInteger(Number(piece))) || piece <= 0 || pieces[0] > Number(piece) || pieces.at(-1) < Number(piece)) {
    throw new Error(`No such piece: ${piece}`);
  }

  function next(increment) {
    if(pieces.filter((e) => e === Number(piece)).length != 1) throw new Error(`There is not exactly one piece with number ${piece}`); //should never happen
    const newPieceIdx = pieces.indexOf(Number(piece)) + increment;
    setSkipped(range(Math.min(Number(piece) + increment, pieces[newPieceIdx]), Math.max(Number(piece) + increment, pieces[newPieceIdx])));
    return '/ratings/' + pieces[newPieceIdx];
  }


  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between'>
      <Snackbar open={skipped.length} onClose={()=>{setSkipped([])}} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert severity='warning'>{getSkippedStr(skipped, 'piece')}</Alert>
      </Snackbar>
      {/* catref control */}
      <Stack direction='row' spacing={2} alignItems='center' width={1}>
        <Typography variant='h6'>ADM</Typography>
        <Typography variant='h6'>188</Typography>
        <Typography variant='h6'>/</Typography>
        <Autocomplete size='small'
                      sx={{width:100}}
                      fullWidth
                      disableClearable
                      autoHighlight
                      options={pieces.map((x)=>({label: '' + x}))}
                      renderInput={(params) => <TextField {...params} label="Piece" data-testid='dropdownSelection'/>}
                      value={piece}
                      onChange={(e, v, r)=>{if(r === 'selectOption') navigate('/ratings/' + v.label)}}
                      data-testid='dropdown'
        />
        {/* Nav forward, backward buttons */}
        <Stack direction='row' spacing={0}>
          <Tooltip title={pieces[0] === Number(piece) ? 'No lower pieces in series 188' : 'Back one piece'}>
            <div>
              <IconButton
                disabled={pieces[0] === Number(piece)}
                onClick={()=>navigate(next(-1))}
                color='primary'
                data-testid='backButton'
              >
                <ArrowForwardIos sx={{transform: 'rotate(180deg)'}}/>
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title={pieces.at(-1) === Number(piece) ? 'No higher pieces in series 188': 'Forward one piece'}>
            <div>
              <IconButton
                disabled={pieces.at(-1) === Number(piece)}
                onClick={()=>navigate(next( 1))}
                color='primary'
                data-testid='forwardButton'
              >
                <ArrowForwardIos/>
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
}
