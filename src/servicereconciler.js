import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ServiceTable from './servicetable';

import IconButton from '@mui/material/IconButton';
import InsertAboveIcon from '@mui/icons-material/Publish';
import InsertBelowIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import OverwriteThatIcon from '@mui/icons-material/KeyboardArrowRight';
import InsertThatIcon from '@mui/icons-material/MenuOpen';

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

export default function ServiceReconciler({personTableData, setPersonTableData, serviceRecords, setServiceRecords}) {
  function getTable(thisTable, thatTable) {

    /* Generates the buttons.
     * Could farm this out to its own component, or to a function that returns the buttons.
     * This would require passing thisTable, thatTable, serviceRecords and setServiceRecords.
     */
    function rowControls(params, sx) {
      const {row, ...otherParams} = params;
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
  return (
    <Stack direction='row' sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      {getTable(1, 2)}
      {getTable(2, 1)}
    </Stack>
  );
}
