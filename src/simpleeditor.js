import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from './datatable';
import { LoadingContext } from './loadingcontext';
import { Alert, CircularProgress, Stack } from '@mui/material';

function queryFn({queryKey}) {
  const [, table] = queryKey;
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onerror = (e) => { reject(e); };
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        resolve([]);
      }
      else {
        resolve(JSON.parse(e.data));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:SimpleData:' + table) };
  });
}

export default function SimpleEditor({table, primary}) {
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const { data: queryData, status: queryStatus } = useQuery({
    queryKey: ['simpleEditor', table],
    queryFn: queryFn,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
  useEffect(() => {
    if(queryStatus === 'success') {
      if(queryData && queryData.length) {
        setRows(queryData);
        setFields(Object.keys(queryData[0]));
      }
      else {
        setRows([]);
        setFields([]);
      }
    }
  }, [queryData, queryStatus]);

  if(fields.length) {
    const columns: GridColDef[] = fields.map((e) => ({
      field: e,
      headerName: e[0].toUpperCase() + e.slice(1),
      editable: e !== primary,
      flex: 1 / fields.length,
    }));
    return (
      <LoadingContext value={queryStatus==='pending'}>
        <DataTable
          rows={rows}
          columns={columns}
          primary={primary}
          onChange={setRows}
        />
      </LoadingContext>
    );
  }
  else if(queryStatus === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  } 
}
