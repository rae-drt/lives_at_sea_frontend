import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import { otherDataQuery } from './queries';
import { LoadingContext } from './loadingcontext';
import DataTable from './datatable';

export default function OtherData() {
  const { sailorType, nameId } = useParams();
  const [data, setData] = useState([]);
  const { data: queryData, status: queryStatus } = useQuery(otherDataQuery(sailorType, nameId));
  useEffect(() => {
    if(queryStatus === 'success') {
      setData(queryData);
    }
  }, [queryData, queryStatus]);

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
