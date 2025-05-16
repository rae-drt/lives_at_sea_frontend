import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Stack } from '@mui/material';
import { LoadingContext } from './loadingcontext';
import DataTable from './datatable';

export default function Other({query, mutate, columns, columnGroupingModel}) {
  const { sailorType, nameId } = useParams();
  const [data, setData] = useState([]);
  const queryClient = useQueryClient();
  const { data: queryData, status: queryStatus } = useQuery(query(sailorType, nameId));
  useEffect(() => {
    if(queryStatus === 'success') {
      setData(queryData);
    }
  }, [queryData, queryStatus]);

  if(queryStatus === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else {
    return(
      <LoadingContext value={queryStatus === 'pending'}>
        <Stack>
          <Stack direction='row' justifyContent='flex-end'>
            <Button onClick={()=>{mutate(queryClient, sailorType, nameId, data);}}>Enter</Button>
          </Stack>
          <DataTable
            rows={data}
            columns={columns}
            columnGroupingModel={columnGroupingModel}
            primary='row'
            positionalPrimary
            onChange={setData}
          />
        </Stack>
      </LoadingContext>
    );
  }
}
