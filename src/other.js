import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import { LoadingContext } from './loadingcontext';
import DataTable from './datatable';

export default function Other({query, columns, columnGroupingModel}) {
  const { sailorType, nameId } = useParams();
  const [data, setData] = useState([]);
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
        <DataTable
          rows={data}
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          primary='row'
          positionalPrimary
          onChange={setData}
        />
      </LoadingContext>
    );
  }
}
