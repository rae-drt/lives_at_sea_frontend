import { useEffect, useState } from 'react';
import { LoadingContext } from './loadingcontext';
import ReactDOM from 'react-dom';

import { Stack, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import DataTable from './datatable';

export default function SimpleEditor({table, primary}) {
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const fetchData = async() => {
      setFetching(true);
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.rows === 'NULL') {
          setRows([]);
        }
        else {
          setRows(JSON.parse(e.data));
        }
        socket.close();
        setFetching(false);
      };
      socket.onopen = () => { socket.send('L@S:SimpleData:' + table) };
    };
    fetchData();
  }, [table]);
  useEffect(() => {
    if(rows && rows.length) {
      setFields(Object.keys(rows[0]));
    }
    else {
      setFields([]);
    }
  }, [rows])
  useEffect(() => { //re https://github.com/mui/mui-x/issues/10578. Unfortunately the 3rd solution requires a non-basic version of DataGrid so we live with the jump.
    const timeoutId = setTimeout(()=>{
      ReactDOM.flushSync(()=>{
        apiRef.current.autosizeColumns({includeOutliers: true, includeHeaders: true, expand: true});
      });
    },1000);
   return () => { clearInterval(timeoutId); }
  }, [rows, apiRef]);
  if((!rows) || rows.length === 0) return null;

  const columns = fields.map((e) => ({
    field: e,
    headerName: e[0].toUpperCase() + e.slice(1),
    editable: (e !== primary),
  }));

  return(
    <LoadingContext value={fetching}>
      <Stack alignItems='flex-start' width='100%'>
        <Typography variant='h6'>{table[0].toUpperCase() + table.slice(1)}</Typography>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>{/* re https://mui.com/x/react-data-grid/layout/#auto-height */}
          <DataTable
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            primary={primary}
            onChange={setRows}
            disableColumnSorting={false}
            disableColumnMenu={false}
          />
        </div>
      </Stack>
    </LoadingContext>
  );
}
