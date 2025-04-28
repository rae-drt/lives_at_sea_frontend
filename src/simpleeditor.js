import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/DeleteForever';

export default function SimpleEditor({table, primary}) {
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const [sortModel, setSortModel] = useState([{field: 'id', sort: 'desc'}]);
  const [visibilityModel, setVisibilityModel] = useState({id: false, [primary]: false});
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.rows === 'NULL') {
          setRows([]);
        }
        else {
          setRows(JSON.parse(e.data).map((x, i)=>({id: i, ...x})));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:SimpleData:' + table) };
    };
    fetchData();
  }, [table]);
  useEffect(() => {
    if(rows && rows.length) setFields(Object.keys(rows[0]));
    else setFields([]);
  }, [rows])
  useEffect(() => {
    function need_empty_last(data_array) {
      const _ = require('lodash');
      if(typeof(data_array) === 'undefined') return false;
      if(data_array.length === 0) return true;
      return !(_.isEqual(Object.keys(data_array[data_array.length - 1]), ['id', primary]));
    }

    if(need_empty_last(rows)) {
      const newRows = structuredClone(rows);
      newRows.push({id: rows.length, [primary]: rows.length ? rows.at(-1)[primary] + 1 : 1});
      setRows(newRows);
    }
  }, [rows]);
  useEffect(() => { //re https://github.com/mui/mui-x/issues/10578. Unfortunately the 3rd solution requires a non-basic version of DataGrid so we live with the jump.
    const timeoutId = setTimeout(()=>{
      ReactDOM.flushSync(()=>{
        apiRef.current.autosizeColumns({includeOutliers: true, includeHeaders: true, expand: true});
      });
    },1000);
   return () => { clearInterval(timeoutId); }
  }, [rows, apiRef]);

  function baseRowControls(params) {
    const {row} = params; //const {row, ...otherParams} = params; would give access to the rest of the params if needed
    const sx = {
      px: 0.2,
      py: 0,
    }
    return (
      <Stack direction='row' spacing={0}>
        <Tooltip title='Delete row' placement='top' followCursor arrow>
          <span>
            <IconButton sx={sx} color='primary' disabled={typeof(rows) === 'undefined' || row.id === rows.length - 1} onClick={()=>{
                const newRows = structuredClone(rows.slice(0, row.id));
                newRows.push(...structuredClone(rows.slice(row.id + 1)));
                for(const x of newRows.slice(row.id)) x.id -= 1;
                setRows(newRows);
              }}>
              <DeleteIcon/>
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  };

  if((!rows) || rows.length === 0) return null;

  const columns: GridColDef[] = fields.map((e) => ({
    field: e,
    headerName: e[0].toUpperCase() + e.slice(1),
    editable: (e !== primary) && (e !== 'id'),
  }));

  return(
    <Stack alignItems='flex-start' width='100%'>
      <Typography variant='h6'>{table[0].toUpperCase() + table.slice(1)}</Typography>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>{/* re https://mui.com/x/react-data-grid/layout/#auto-height */}
        <DataGrid
          apiRef={apiRef}
          sortModel={sortModel}
          onSortModelChange={(x)=>setSortModel(x)}
          columnVisibilityModel={visibilityModel}
          onColumnVisibilityModelChange={(x)=>setVisibilityModel(x)}
          density='compact'
          rows={rows}
          columns={[...columns, {
              field: 'row_controls',
              headerName: '',
              renderCell: baseRowControls,
            },
          ]}
          onProcessRowUpdateError={(e)=>{alert(e);}}
          processRowUpdate={(updatedRow, originalRow, {rowId}) =>{
            const newRows = structuredClone(rows);
            newRows[rowId] = structuredClone(updatedRow);
            setRows(newRows);
            return updatedRow;
          }}
          sx={{
            [`.${gridClasses.cell}`]: {
              display: 'flex',
              alignItems: 'center',
              padding: '0px',
              pl: '3px',
              pr: '3px',
            },
            '& .MuiDataGrid-cell, .MuiDataGrid-columnHeader': { py: '3px', border: 1 },
            '& .MuiDataGrid-columnSeparator': { display: 'none' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' },
          }}
        />
      </div>
    </Stack>
  );
}
