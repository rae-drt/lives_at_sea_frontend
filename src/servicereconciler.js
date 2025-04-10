import { useContext} from 'react';
import { useParams } from 'react-router';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ServiceTable from './servicetable';
import { SERVICE_FIELDS } from './data_utils';

import IconButton from '@mui/material/IconButton';
import OverwriteThatIcon from '@mui/icons-material/KeyboardArrowRight';
import InsertThatIcon from '@mui/icons-material/MenuOpen';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HappyIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SadIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { LoadingContext } from './loadingcontext';

const _ = require('lodash');

function getDifferenceMap(table1, table2) {
  return _.reduce(table1, (rowDifference, rowContent, rowIndex) => {
      if(rowIndex in table2) { //check for this in case one table is longer than the other. will work out regardless of which is longer, as either way we get an array of less rows than the longer table.
        rowDifference.push(
          _.reduce(rowContent, (cellDifference, cellContent, cellKey) => {
            if(!_.isEqual(cellContent, table2[rowIndex][cellKey])) {
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
  );
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
export default function ServiceReconciler({personTableData, setPersonTableData, serviceRecords, setServiceRecords}) {
  const {nameId} = useParams();

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
      emptyRows.push(row.row)
    }

    //delete the empty rows -- go backwards so that the indices continue to work
    for(const emptyRow of emptyRows.reverse()) {
      newRows.splice(emptyRow - 1, 1);
    }

    //renumber the remaining rows
    for(let i = 0; i < newRows.length; i++) {
      newRows[i].row = i + 1;
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
      // row.row is the row number as presented in the table. This is one higher than the array index of the row.
      return (
        <>
          <Tooltip title={'Overwrite row in ' + (thisTable < thatTable ? 'right' : 'left') + ' table'} placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords[thatTable].slice(0, row.row - 1));
                  newTable.push(structuredClone(row));
                  newTable.push(...structuredClone(serviceRecords[thatTable].slice(row.row)));
                  setServiceRecords({[thisTable]: structuredClone(serviceRecords[thisTable]), [thatTable]: newTable});
                }}>
                  <OverwriteThatIcon sx={{transform: thisTable < thatTable ? 'rotate(0)' : 'rotate(180deg)'}}/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={'Insert row into ' + (thisTable < thatTable ? 'right' : 'left') + ' table'} placement='top' followCursor arrow>
            <span>
              <IconButton sx={sx} color='primary' onClick={()=>{
                  const newTable = structuredClone(serviceRecords[thatTable].slice(0, row.row - 1));
                  newTable.push({...row, row: newTable.length + 1}); //do it like this in case we are pushing a row towards the end of a longer table (otherwise the row would be too high)
                  newTable.push(...structuredClone(serviceRecords[thatTable].slice(row.row - 1)));
                  for(const x of newTable.slice(row.row)) x.row += 1;
                  setServiceRecords({[thisTable]: structuredClone(serviceRecords[thisTable]), [thatTable]: newTable});
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
        transcriber={personTableData['tr' + thisTable + 'id']}
        complete={personTableData['complete' + thisTable]}
        cloneButton={
          <Tooltip title='Replace other table with this table'>
            <span>
              <Button
                disabled={differenceMap === null}
                onClick={() => { setServiceRecords({
                  [thisTable]: serviceRecords[thisTable],
                  [thatTable]: structuredClone(serviceRecords[thisTable])
                });}}
              >{ thisTable < thatTable ?
                   thisTable + ' ' + String.fromCharCode(8658) + ' ' + thatTable :
                   thatTable + ' ' + String.fromCharCode(8656) + ' ' + thisTable
               }
              </Button>
            </span>
          </Tooltip>
        }
        flipComplete={()=>{ setPersonTableData({...personTableData, ['complete' + thisTable]: !personTableData['complete' + thisTable]})}}
        data={serviceRecords[thisTable]}
        onChange={(d)=>{setServiceRecords({[thisTable]: d, [thatTable]: structuredClone(serviceRecords[thatTable])});}}
        difference={differenceMap}
        extraRowControls={rowControls}
      />
    );
  }
    //TODO: Assuming that we get an empty array when there are no service records, and hence can check for length == 0
  const differenceMap = (serviceRecords.length === 0 || _.isEqual(serviceRecords[1], serviceRecords[2])) ?
    null : //null if the services are identical. If there is any difference, the array will be the same length as the shorter services table (potentially empty, making _all_ rows in the longer table "different").
           //TODO it may well be that if one table is empty, the API just doesn't return anything at all for it -- if so, I can make that work for me by passing an empty array in place of the missing entry
    getDifferenceMap(serviceRecords[1], serviceRecords[2]);
  const sameServices = serviceRecords.length === 0 ? true : _.isEqual(serviceRecords[1], serviceRecords[2]);
  const xCheckReady = personTableData.tr1id > 0 &&
                      personTableData.tr2id > 0 &&
                      personTableData.complete1 &&
                      personTableData.complete2 &&
                      sameServices
  return (
    <Stack>
      <Stack direction='row' justifyContent='flex-end' spacing={4}>
        <XCheck ready={xCheckReady} checked={personTableData.reconciled} onChange={()=>{setPersonTableData({...personTableData, reconciled: !personTableData.reconciled})}}/>
        <Button disabled={!xCheckReady} onClick={()=>{
          setServiceRecords({1: deleteEmptyServiceRows(serviceRecords[1]), 2: deleteEmptyServiceRows(serviceRecords[2])});
          fetch(process.env.REACT_APP_API_ROOT + 'service?nameid=' + nameId, {
            method: "POST",
            body: JSON.stringify({1: serviceRecords[1].slice(0, serviceRecords[1].length - 1), 2: serviceRecords[2].slice(0, serviceRecords[2].length -1)}),
          }).then(Function.prototype(),(x)=>{alert(x);}); //Function.prototype is a nop
        }}>Enter</Button>
      </Stack>
      <Stack direction='row' sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        {getTable(1, 2)}
        {getTable(2, 1)}
      </Stack>
    </Stack>
  );
}
