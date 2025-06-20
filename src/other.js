import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useRecord } from './cache';
import { Alert, Button, Stack } from '@mui/material';
import { LoadingContext } from './loadingcontext';
import DataTable from './datatable';
import { useDirty } from './dirty';

export default function Other({query, mutate, tag, columns, columnGroupingModel}) {
  const { sailorType, nameId } = useParams();
  const queryClient = useQueryClient();
  const { data, setData, status } = useRecord(sailorType, nameId, tag);
  const dirty = useDirty((state)=>state[tag]);

  if(status === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else {
    return(
      <LoadingContext value={status === 'pending'}>
        <Stack width='140em'>
          <Stack direction='row' justifyContent='flex-end'>
            <Button disabled={!dirty} onClick={()=>{mutate(queryClient, sailorType, nameId, data);}}>Enter</Button>
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
