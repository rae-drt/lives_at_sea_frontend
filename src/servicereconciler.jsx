import { useContext } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useDialogs } from '@toolpad/core/useDialogs';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ServiceTable from './servicetable';
import CircularProgress from '@mui/material/CircularProgress';
import { useRecord, failedMutationDialog } from './queries';
import { DirtySailorContext } from './dirty';
import { useEmptyRowOK } from './datatable';

import IconButton from '@mui/material/IconButton';
import OverwriteThatIcon from '@mui/icons-material/KeyboardArrowRight';
import InsertThatIcon from '@mui/icons-material/MenuOpen';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HappyIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { LoadingContext } from './loadingcontext';
import { snapshot } from './snapshot';

import { isEqual, reduce } from 'lodash';

const ROW_PRIMARY = 'rowid';

function getDifferenceMap(table1, table2) {
  function _getDifferenceMap(outerTable, innerTable) {
    return reduce(outerTable, (rowDifference, rowContent, rowIndex) => {
      if(rowIndex in innerTable) { //check for this in case one table is longer than the other. will work out regardless of which is longer, as either way we get an array of less rows than the longer table.
        rowDifference.push(
          reduce(rowContent, (cellDifference, cellContent, cellKey) => {
            if(!isEqual(cellContent, innerTable[rowIndex][cellKey])) {
              cellDifference[cellKey] = '';
            }
            return cellDifference;
          },
          {} /*This will be passed/returned as cellDifference, accumulating*/)
        );
      }
      return rowDifference;
    },
    [] /*This will be passed/returned as rowDifference, accumulating*/
  )};
  const map1 = _getDifferenceMap(table1, table2);
  const map2 = _getDifferenceMap(table2, table1);
  const map = [];
  for(let i = 0; i < Math.min(map1.length, map2.length); i += 1) {
    map.push({...(map1[i]), ...(map2[i])});
  }
  return map;
}

function XCheck({ready, checked, onChange}) {
  const loading = useContext(LoadingContext);
  return (
    <Stack direction='row' alignItems='center'>
      {ready ? <HappyIcon sx = {{color: 'green'}}/> : <SadIcon sx = {{color: 'red'}}/>}
      <FormControlLabel control={<Checkbox disabled={loading || (!ready)} checked={checked} onChange={onChange}/>} label='Xcheck' labelPlacement='start'/>
    </Stack>
  );
}

export default function ServiceReconciler() {
  const {sailorType, nameId} = useParams();
  const [searchParams,] = useSearchParams();
  const { data: serviceRecords, setData: setServiceRecords, mutation: serviceRecordsMutation, status: serviceRecordsQueryStatus } = useRecord(sailorType, nameId, 'service');
  const dirty = useContext(DirtySailorContext).service;
  const emptyOK = useEmptyRowOK(serviceRecords.services.map((x)=>x.records), ROW_PRIMARY);
  const dialogs = useDialogs();

  if(serviceRecordsQueryStatus === 'error') {
    return(<Alert severity='error'>Error fetching data</Alert>);
  }
  else if(serviceRecordsQueryStatus === 'pending' || serviceRecordsMutation.status === 'pending') {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }

  /* Confirm that the passed data array is safe to use in the service table interfaces
     These assume a row property one greater than array index
     This is only important for computing differences between the two tables, so the integrity check is only needed in this component.
   * If the array is undefined or empty then it is necessarily safe.
   * Otherwise, all members of the array must:
   *   1. Have a row property
   *   2. The row property must be an integer
   *   3. The row property must be one greater than the array index of the member
   * Additionally, the first member of the array must have a row of 1.
   */
  function valid_rows(data_array) {
    if(typeof(data_array) === 'undefined') {
      return true;
    }
    if(data_array.length === 0) {
      return true;
    }
    for(let i = 0; i < data_array.length; i++) {
      if(ROW_PRIMARY in data_array[i] === false) {
        return false;
      }
      if(Number.isInteger(data_array[i][ROW_PRIMARY]) === false) {
        return false;
      }
      if(data_array[i][ROW_PRIMARY] !== i + 1) {
        return false;
      }
    }
    return data_array[0][ROW_PRIMARY] === 1;
  }

  for(const records of serviceRecords.services) {
    if(!valid_rows(records.records)) {
      return(<Alert severity='error'>Rows do not start at 1 and/or are not consecutive.</Alert>);
    }
  }

  function getTable(thisTable, thatTable) {

    /* Generates the buttons.
     * Could farm this out to its own component, or to a function that returns the buttons.
     * This would require passing thisTable, thatTable, serviceRecords and setServiceRecords.
     */
    function rowControls(params, sx) {
      const {row} /*, ...otherParams}*/ = params;
      // row[ROW_PRIMARY] is the row number as presented in the table. This is one higher than the array index of the row.
      return (
        <>
          <Tooltip title={'Overwrite row in ' + (thisTable < thatTable ? 'right' : 'left') + ' table'} placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} fontSize='inherit' color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords.services[thatTable].records.slice(0, row[ROW_PRIMARY] - 1));
                  newTable.push({...structuredClone(row), [ROW_PRIMARY]: newTable.length + 1}); //do it like this in case we are pushing a row towards the end of a longer table (otherwise the row would be too high)
                  newTable.push(...structuredClone(serviceRecords.services[thatTable].records.slice(row[ROW_PRIMARY])));
                  const clone = structuredClone(serviceRecords);
                  clone.services[thatTable].records = newTable;
                  setServiceRecords(clone);
                }}>
                  <OverwriteThatIcon sx={{transform: thisTable < thatTable ? 'rotate(0)' : 'rotate(180deg)'}}/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={'Insert row into ' + (thisTable < thatTable ? 'right' : 'left') + ' table'} placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} fontSize='inherit' color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords.services[thatTable].records.slice(0, row[ROW_PRIMARY] - 1));
                  newTable.push({...structuredClone(row), [ROW_PRIMARY]: newTable.length + 1}); //do it like this in case we are pushing a row towards the end of a longer table (otherwise the row would be too high)
                  newTable.push(...structuredClone(serviceRecords.services[thatTable].records.slice(row[ROW_PRIMARY] - 1)));
                  for(const x of newTable.slice(row[ROW_PRIMARY])) x[ROW_PRIMARY] += 1;
                  const clone = structuredClone(serviceRecords);
                  clone.services[thatTable].records = newTable;
                  setServiceRecords(clone);
                }}>
                  <InsertThatIcon sx={{transform: thisTable < thatTable ? 'rotate(180deg)' : 'rotate(0)'}}/>
              </IconButton>
            </span>
          </Tooltip>
        </>
      );
    };
    return (
      <ServiceTable
        transcriber={serviceRecords.services[thisTable].userid}
        complete={serviceRecords.services[thisTable].complete}
        reconciled={serviceRecords.reconciled}
        primary={ROW_PRIMARY}
        cloneButton={
          <Tooltip title='Replace other table with this table'>
            <span>
              <Button
                disabled={differenceMap === null}
                onClick={() => {
                  const clone = structuredClone(serviceRecords);
                  clone.services[thatTable].records = structuredClone(serviceRecords.services[thisTable].records);
                  setServiceRecords(clone);
                }}
              >{ thisTable < thatTable ?
                   (thisTable + 1) + ' ' + String.fromCharCode(8658) + ' ' + (thatTable + 1):
                   (thatTable + 1) + ' ' + String.fromCharCode(8656) + ' ' + (thisTable + 1)
               }
              </Button>
            </span>
          </Tooltip>
        }
        flipComplete={()=>{
          const clone = structuredClone(serviceRecords);
          clone.services[thisTable].complete = !clone.services[thisTable].complete;
          setServiceRecords(clone);
        }}
        data={serviceRecords.services[thisTable].records}
        onChange={(d)=>{
          const clone = structuredClone(serviceRecords);
          clone.services[thisTable].records = structuredClone(d);
          setServiceRecords(clone);
        }}
        difference={differenceMap}
        extraRowControls={rowControls}
        controlCount={5}
      />
    );
  }
  function getSingleTable() {
    return (
      <div data-testid={'serviceTable'}>
        <ServiceTable
          transcriber={serviceRecords.services[0].userid}
          complete={serviceRecords.services[0].complete}
          reconciled={serviceRecords.reconciled}
          primary={ROW_PRIMARY}
          flipComplete={()=>{
            const clone = structuredClone(serviceRecords);
            clone.services[0].complete = !clone.services[0].complete;
            setServiceRecords(clone);
          }}
          data={serviceRecords.services[0].records}
          onChange={(d)=>{
            const clone = structuredClone(serviceRecords);
            clone.services[0].records = structuredClone(d);
            setServiceRecords(clone);
          }}
          difference={differenceMap}
        />
      </div>
    );
  }

    //TODO: Assuming that we get an empty array when there are no service records, and hence can check for length == 0
  const differenceMap = (serviceRecords.services.length === 0 || serviceRecords.services.length === 1 || isEqual(serviceRecords.services[0].records, serviceRecords.services[1].records)) ?
    null : //null if the services are identical. If there is any difference, the array will be the same length as the shorter services table (potentially empty, making _all_ rows in the longer table "different").
           //TODO it may well be that if one table is empty, the API just doesn't return anything at all for it -- if so, I can make that work for me by passing an empty array in place of the missing entry
    getDifferenceMap(serviceRecords.services[0].records, serviceRecords.services[1].records);
  const sameServices = (serviceRecords.services.length === 0 || serviceRecords.services.length === 1) ? true : isEqual(serviceRecords.services[0].records, serviceRecords.services[1].records);
  const xCheckReady = serviceRecords.services.every((x)=>x.userid > 0) &&
                      serviceRecords.services.every((x)=>x.complete > 0) &&
                      sameServices;
  if(!xCheckReady) serviceRecords.reconciled = false; //if the checkbox is, or becomes, unready then the reconciled state should be cleared
  return (
    <Stack sx={{padding: 2}} id='servicereconciler_for_snapshot'>
      <Stack direction='row' justifyContent='flex-end' spacing={4} sx={{paddingBottom: 2}}>
        <XCheck ready={xCheckReady} checked={serviceRecords.reconciled} onChange={() => {
            const clone = structuredClone(serviceRecords);
            clone.reconciled = !(serviceRecords.reconciled);
            setServiceRecords(clone);
          }}/>
         <Button variant='outlined'
                 disabled={(!searchParams.get('devMode')) && ((!xCheckReady) || (!dirty))}
                 onClick={
                   async ()=>{
                     (await emptyOK()) && snapshot('servicereconciler_for_snapshot', searchParams.get('devMode'), serviceRecords).then(()=>{
                       serviceRecordsMutation.mutate(structuredClone(serviceRecords), {
                         onError: failedMutationDialog(dialogs, serviceRecordsMutation),
                       });
                     });
                   }
                 }
         >Enter</Button>
      </Stack>
      <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'space-between'}} spacing={2}>
        {
          serviceRecords.services.length === 1 ? (getSingleTable())
                                               : (<>{getTable(0, 1)}{getTable(1, 0)}</>)
        }
      </Stack>
    </Stack>
  );
}
