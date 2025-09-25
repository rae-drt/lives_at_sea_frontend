import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router';
import { LoadingContext } from './loadingcontext';
import PersonControlPanel from './personcontrolpanel';
import { pieceQuery } from './queries';
import { useQuery } from '@tanstack/react-query';

import { Alert, Snackbar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import WestIcon from '@mui/icons-material/ArrowBack'
import EastIcon from '@mui/icons-material/ArrowForward';

export function RecordNavigator({piece}) {
  const { sailorType, nameId } = useParams();
  const navigate = useNavigate();
  const [searchParams, ] = useSearchParams();
  const [checkSkipped, setCheckSkipped] = useState(true);
  const loc = useLocation();
  useEffect(() => {
    setCheckSkipped(true);
  }, [loc]);
  const { data: pieceData,  status: pieceStatus } = useQuery({...pieceQuery(piece)});

  function getSkippedStr(skipped) {
    if(skipped) {
      if(skipped.length === 1)    return `Skipped missing item ${skipped[0]}`;
      else if(skipped.length > 1) return `Skipped missing items ${skipped.slice(0, -1).join(', ')} and ${skipped.at(-1)}`;
    }
    return '';
  }
  function currentIndex() {
    const idx = pieceData.records.findIndex((e, i, a) => {
      if(e.person_id === Number(nameId)) {
        if(a.slice(i + 1).find((x) => x.person_id === Number(nameId))) { throw new Error(`Multiple cases of person_id ${nameId} in piece array`); } //should never happen
        return true;
      }
      return false;
    });
    if(idx === -1) throw new Error(`person_id ${nameId} does not exist in piece array`); //should never happen
    return idx;
  }
  function next(increment) {
    const currentIdx = currentIndex();
    let idx = currentIdx + increment;
    const skipped = [];
    while(idx < pieceData.records.length && idx >= 0 && pieceData.records[idx].person_id === null) {
      skipped.push(pieceData.records[idx].gen_item);
      idx += increment;
    }
    const nextUrl = `/person/${sailorType}/${pieceData.records[idx].person_id}/main`;
    if(skipped.length > 0) { return nextUrl + '?skipped=' + skipped.join() }
    else { return nextUrl; }
  }
  function RecordNavigatorBack() {
    const loading = useContext(LoadingContext) || (pieceStatus !== 'success');
    return(
      <IconButton disabled={loading} onClick={()=>navigate(next(-1))}><WestIcon color='primary'/></IconButton>
    );
  }
  function RecordNavigatorForward() {
    const loading = useContext(LoadingContext) || (pieceStatus !== 'success');
    return(
      <IconButton disabled={loading} onClick={()=>navigate(next( 1))}><EastIcon color='primary'/></IconButton>
    );
  }

  //re https://github.com/mui/material-ui/issues/5393, https://stackoverflow.com/questions/67578008/how-to-get-value-from-material-ui-textfield-after-pressing-enter
  function RecordNavigatorTeleport() {
    const [valid, setValid] = useState(true);
    const [popoverAnchor, setPopoverAnchor] = useState(false);

    return (
      <>
        <Typography onClick={(e)=>{setPopoverAnchor(e.currentTarget)}}>Record</Typography>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <TextField
            onKeyPress={(e) => {
              if(e.key === 'Enter' && valid) {
                const intendedSailor = e.target.value.trim();
                if(intendedSailor.includes('/')) navigate('/person/' + intendedSailor);
                else navigate('/person/' + sailorType + '/' + e.target.value);
                setPopoverAnchor(false);
              }
            }}
            onKeyDown={(e)=>{e.key === 'Escape' && setPopoverAnchor(false);}}
            defaultValue={nameId}
            onChange={(e)=>{setValid(/(?:rating\/|officer\/)?\d+$/.test(e.target.value.trim()));}}
            error={!valid}
            helperText={valid || 'Enter nameid with optional sailor type. Examples: 100123; rating/100123; officer/7.'}
          />
        </Popover>
      </>
    );
  }

  const skippedMsg = getSkippedStr(searchParams.get('skipped')?.split(','));
  return (
    <Stack direction='row' alignItems='center'>
      <Snackbar open={checkSkipped && searchParams.get('skipped')} onClose={()=>{setCheckSkipped(false)}} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert severity='warning'>{skippedMsg}</Alert>
      </Snackbar>
      <RecordNavigatorBack/>
      <RecordNavigatorTeleport/>
      <RecordNavigatorForward/>
    </Stack>
  );
}

export default function ExistingPersonControlPanel(props) {
  return (
    <PersonControlPanel navigator={<RecordNavigator piece={props.data.piece}/>} {...props}/>
  );
}
