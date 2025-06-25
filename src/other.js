import { useContext } from 'react';
import { useParams } from 'react-router';
import { useRecord } from './queries';
import { Alert, Button, Stack } from '@mui/material';
import { LoadingContext } from './loadingcontext';
import { useEmptyRowOK , DataTable } from './datatable';
import { DirtySailorContext } from './dirty';

export default function Other({mutate, tag, columns, columnGroupingModel}) {
  const { sailorType, nameId } = useParams();
  const { data, setData, mutateData, status: queryStatus } = useRecord(sailorType, nameId, tag);
  const dirty = useContext(DirtySailorContext)[tag];
  const emptyOK = useEmptyRowOK([data], 'row');

  if(queryStatus === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else {
    return(
      <LoadingContext value={queryStatus === 'pending'}>
        <Stack width='140em'>
          <Stack direction='row' justifyContent='flex-end'>
            <Button disabled={!dirty} onClick={async ()=>{(await emptyOK()) && mutateData(data)}}>Enter</Button>
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
