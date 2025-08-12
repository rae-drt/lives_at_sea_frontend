import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Alert, CircularProgress, Stack, Typography, Tooltip, TextField, Autocomplete, IconButton } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { piecesQuery } from './queries';

export default function RatingsIndexNavigator() {
  const { piece } = useParams();
  const { data: pieces, status: queryStatus } = useQuery(piecesQuery);
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

  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between'>
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
                      renderInput={(params) => <TextField {...params} label="Piece"/>}
                      value={piece}
                      onChange={(e, v, r)=>{if(r === 'selectOption') navigate('/ratings/' + v.label)}}
        />
        {/* Nav forward, backward buttons */}
        <Stack direction='row' spacing={0}>
          <Tooltip title='Back one piece'>
            <div>
              <IconButton
                disabled={pieces[0] === Number(piece)}
                onClick={()=>navigate('/ratings/' + (pieces[pieces.indexOf(Number(piece)) - 1]))}
                color='primary'
              >
                <ArrowForwardIos sx={{transform: 'rotate(180deg)'}}/>
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title='Forward one piece'>
            <div>
              <IconButton
                disabled={pieces.at(-1) === Number(piece)}
                onClick={()=>navigate('/ratings/' + (pieces[pieces.indexOf(Number(piece)) + 1]))}
                color='primary'
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
