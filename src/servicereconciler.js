import { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ServiceTable from './servicetable';
import { SERVICE_FIELDS } from './data_utils';
import { serviceRecordsQuery, serviceRecordsMutate } from './queries';

import IconButton from '@mui/material/IconButton';
import OverwriteThatIcon from '@mui/icons-material/KeyboardArrowRight';
import InsertThatIcon from '@mui/icons-material/MenuOpen';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HappyIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { LoadingContext } from './loadingcontext';

const _ = require('lodash');

const ROW_PRIMARY = 'rowid';

function getDifferenceMap(table1, table2) {
  function _getDifferenceMap(outerTable, innerTable) {
    return _.reduce(outerTable, (rowDifference, rowContent, rowIndex) => {
      if(rowIndex in innerTable) { //check for this in case one table is longer than the other. will work out regardless of which is longer, as either way we get an array of less rows than the longer table.
        rowDifference.push(
          _.reduce(rowContent, (cellDifference, cellContent, cellKey) => {
            if(!_.isEqual(cellContent, innerTable[rowIndex][cellKey])) {
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

const EMPTY_SERVICE_HISTORY = {
  reconciled: false,
  services: [
    { userid:0, complete:0, records:[] },
    { userid:0, complete:0, records:[] },
  ]
};

export default function ServiceReconciler() {
  const {nameId} = useParams();
  const [searchParams,] = useSearchParams();
  const queryClient = useQueryClient();
  const [serviceRecords, setServiceRecords] = useState(EMPTY_SERVICE_HISTORY);
  const {data: queryData, status: queryStatus} = useQuery(serviceRecordsQuery(nameId));
  useEffect(() => {
    if(queryStatus === 'success') {
      setServiceRecords(queryData);
    }
    else {
      setServiceRecords(EMPTY_SERVICE_HISTORY);
    }
  }, [queryData, queryStatus]);

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

  function deleteEmptyServiceRows(services) {
    const newRows = structuredClone(services);

    //identify the empty rows
    const emptyRows = [];
    outer:
    for(const row of newRows) {
      for(const field of SERVICE_FIELDS) {
        if(row[field]) { //Anything truthy here means that the row has some real content somewhere
          continue outer;
        }
      }
      emptyRows.push(row[ROW_PRIMARY])
    }

    //delete the empty rows -- go backwards so that the indices continue to work
    for(const emptyRow of emptyRows.reverse()) {
      newRows.splice(emptyRow - 1, 1);
    }

    //renumber the remaining rows
    for(let i = 0; i < newRows.length; i++) {
      newRows[i][ROW_PRIMARY] = i + 1;
    }

    return newRows;
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
              <IconButton sx={sx} color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords.services[thatTable].records.slice(0, row[ROW_PRIMARY] - 1));
                  newTable.push(structuredClone(row));
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
              <IconButton sx={sx} color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords.services[thatTable].records.slice(0, row[ROW_PRIMARY] - 1));
                  newTable.push({...row, [ROW_PRIMARY]: newTable.length + 1}); //do it like this in case we are pushing a row towards the end of a longer table (otherwise the row would be too high)
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
      />
    );
  }
    //TODO: Assuming that we get an empty array when there are no service records, and hence can check for length == 0
  const differenceMap = (serviceRecords.services.length === 0 || _.isEqual(serviceRecords.services[0].records, serviceRecords.services[1].records)) ?
    null : //null if the services are identical. If there is any difference, the array will be the same length as the shorter services table (potentially empty, making _all_ rows in the longer table "different").
           //TODO it may well be that if one table is empty, the API just doesn't return anything at all for it -- if so, I can make that work for me by passing an empty array in place of the missing entry
    getDifferenceMap(serviceRecords.services[0].records, serviceRecords.services[1].records);
  const sameServices = serviceRecords.length === 0 ? true : _.isEqual(serviceRecords.services[0].records, serviceRecords.services[1].records);
  const xCheckReady = serviceRecords.services[0].userid > 0 &&
                      serviceRecords.services[1].userid > 0 &&
                      serviceRecords.services[0].complete &&
                      serviceRecords.services[1].complete &&
                      sameServices
  return (
    <Stack>
      <Stack direction='row' justifyContent='flex-end' spacing={4}>
        <XCheck ready={xCheckReady} checked={serviceRecords.reconciled} onChange={() => {
            const clone = structuredClone(serviceRecords);
            clone.reconciled = !(serviceRecords.reconciled);
            setServiceRecords(clone);
          }}/>
         <Button disabled={(!searchParams.get('devMode')) && ((!xCheckReady) || _.isEqual(serviceRecords, queryData))}
                 onClick={()=>{//TODO -- this will need fixing, but may change into a single top-level Enter button, which would also allow me to remove the nameid param here (but on the other hand there is something to be said for being tightly tied to the xcheck button)
           const clone = structuredClone(serviceRecords);
           clone.services[0].records = deleteEmptyServiceRows(serviceRecords.services[0].records);
           clone.services[1].records = deleteEmptyServiceRows(serviceRecords.services[1].records);
            //TODO: This is async and slow, need to suspense or something
            serviceRecordsMutate(queryClient, nameId, clone);
        }}>Enter</Button>
      </Stack>
      <Stack direction='row' sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        {getTable(0, 1)}
        {getTable(1, 0)}
      </Stack>
    </Stack>
  );
}
