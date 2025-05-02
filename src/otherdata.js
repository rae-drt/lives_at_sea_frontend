import { useEffect, useState } from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';

import DataTable from './datatable';
import { LoadingContext } from './loadingcontext';
import { useParams } from 'react-router';

function qf({queryKey}) {
  const [key, nameId] = queryKey;
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    console.log('FETCHING');
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
    socket.onopen = () => { socket.send('L@S:OtherData:' + nameId) };
  });
}

export default function OtherData() {
  const queryClient = new QueryClient();
  const {nameId} = useParams();
  const queryKey = ['otherData', nameId];
  const { data, status, ...gubbins } = useQuery({queryKey: queryKey, queryFn: qf, cacheTime: 1000});//, refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: true});
  console.log(data);

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: 'date',
      headerName: 'Date',
      children: [ { field: 'day' }, { field: 'month' }, { field: 'year' } ],
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'row',
      headerName: 'Row',
      width: 50,
      align: 'right',
    },
    {
      field: 'reference',
      headerName: 'Source',
      width: 200,
      editable: true,
    },
    {
      field: 'subref',
      headerName: 'Piece etc',
      width: 200,
      editable: true,
    },
    {
      field: 'day',
      headerName: 'D',
      width: 50,
      editable: true,
    },
    {
      field: 'month',
      headerName: 'M',
      width: 50,
      editable: true,
    },
    {
      field: 'year',
      headerName: 'Y',
      width: 50,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Data Type',
      width: 200,
      editable: true,
    },
    {
      field: 'entry',
      headerName: 'Entry',
      width: 200,
      editable: true,
    },
  ];
        console.log(queryClient.getQueryData(queryKey));
  return(
    <LoadingContext value={status !== 'success'}>
      <DataTable
        rows={queryClient.getQueryData(queryKey)}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        primary='row'
        positionalPrimary
        onChange={(x)=>{console.log(x); queryClient.setQueryData(queryKey, x); console.log(data);}}
      />
    </LoadingContext>
  );
}
