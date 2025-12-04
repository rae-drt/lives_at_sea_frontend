import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router';
import { LoadingContext } from './loadingcontext';
import { LockedContext } from './lockedcontext';
import PersonControlPanel from './personcontrolpanel';
import { pieceQuery, refToPersonIdQuery } from './queries';
import { useQuery } from '@tanstack/react-query';
import { getSkippedStr } from './data_utils';

import { Alert, CircularProgress, Snackbar, Tooltip, InputAdornment } from '@mui/material';
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
    try {
      const currentIdx = currentIndex();
      let idx = currentIdx + increment;
      const skipped = [];
      while(idx < pieceData.records.length && idx >= 0 && pieceData.records[idx].person_id === null) {
        skipped.push(pieceData.records[idx].gen_item);
        idx += increment;
      }
      if(increment < 0 && idx === -1)                       return skipped;
      if(increment > 0 && idx === pieceData.records.length) return skipped;
      const nextUrl = `/person/${sailorType}/${pieceData.records[idx].person_id}/main`;
      if(skipped.length > 0) { return nextUrl + '?skipped=' + skipped.join() }
      else { return nextUrl; }
    }
    catch(e) { //log the error and disable the forward/backward buttons
      console.error(e);
      return [];
    }
  }
  function RecordNavigatorBack() {
    const loading = useContext(LoadingContext) || (pieceStatus !== 'success');
    const [locked, setLocked] = useContext(LockedContext);
    const nextUrl = loading ? null : next(-1);
    const lastItem = typeof(nextUrl) !== 'string';
    return(
      <Tooltip title={lastItem ? `No lower items in piece ${piece}. ${getSkippedStr(nextUrl, 'item')}` : ''}>
        <span>
          <IconButton disabled={loading || locked || lastItem} color='primary' onClick={()=>{
            setLocked(true);
            navigate(nextUrl);
            setLocked(false);
          }}>
            <WestIcon color='inherit'/>
          </IconButton>
        </span>
      </Tooltip>
    );
  }
  function RecordNavigatorForward() {
    const loading = useContext(LoadingContext) || (pieceStatus !== 'success');
    const [locked, setLocked] = useContext(LockedContext);
    const nextUrl = loading ? null : next( 1);
    const lastItem = typeof(nextUrl) !== 'string';
    return(
      <Tooltip title={lastItem ? `No higher items in piece ${piece}. ${getSkippedStr(nextUrl, 'item')}` : ''}>
        <span>
          <IconButton disabled={loading || locked || lastItem} color='primary' onClick={()=>{
            setLocked(true);
            navigate(nextUrl);
            setLocked(false);
          }}>
            <EastIcon color='inherit'/>
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  //re https://github.com/mui/material-ui/issues/5393, https://stackoverflow.com/questions/67578008/how-to-get-value-from-material-ui-textfield-after-pressing-enter
  function RecordNavigatorTeleport() {
    const loading = useContext(LoadingContext) || (pieceStatus !== 'success');
    const [locked, setLocked] = useContext(LockedContext);
    const [valid, setValid] = useState(true);
    const [ref, setRef] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(false);
    const { data: nameId, status: queryStatus } = useQuery({...refToPersonIdQuery(ref.piece, ref.item), enabled: () => ref !== false});
    useEffect(() => {
      queryStatus === 'success' && navigate('/person/rating/' + nameId);
    }, [queryStatus, nameId]);

    if(queryStatus === 'pending' && ref !== false) {
      return (<CircularProgress/>);
    }

    return (
      <>
        <Snackbar open={queryStatus === 'error' && ref !== false} onClose={()=>setRef(false)} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}><Alert severity='error'>No identifier found for ADM 188/{ref.piece}/{ref.item}</Alert></Snackbar>
        <Typography onClick={(e)=>{(!locked) && (!loading) && setPopoverAnchor(e.currentTarget)}}>Record</Typography>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <TextField
            disabled = {loading || locked}
            slotProps = {{
              input: {
                startAdornment: <InputAdornment position='start'>ADM 188/</InputAdornment>,
              }
            }}
            onKeyPress={(e) => {
              if(e.key === 'Enter' && valid) {
                setLocked(true);
                const intendedSailor = e.target.value.trim();
                if(intendedSailor.startsWith('rating/') || intendedSailor.startsWith('officer/')) {
                  navigate('/person/' + intendedSailor);
                }
                else if(/^\d+$/.test(intendedSailor)) {
                  navigate('/ratings/' + intendedSailor);
                }
                else {
                  const bits = e.target.value.split('/');
console.log(bits[0].trim(), bits[1].trim());
                  setRef({piece: bits[0].trim(), item: bits[1].trim()});
                }
                setPopoverAnchor(false);
                setLocked(false);
              }
            }}
            onKeyDown={(e)=>{e.key === 'Escape' && setPopoverAnchor(false);}}
            onChange={(e)=>{setValid(/^(?:rating\/|officer\/)?\d+$/.test(e.target.value.trim()) || /^\d+\/\d+$/.test(e.target.value.trim()));}}
            error={!valid}
          />
        </Popover>
      </>
    );
  }

  return (
    <Stack direction='row' alignItems='center'>
      <Snackbar open={checkSkipped && searchParams.get('skipped')} onClose={()=>{setCheckSkipped(false)}} autoHideDuration={5000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert severity='warning'>{getSkippedStr(searchParams.get('skipped')?.split(','), 'item')}</Alert>
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
