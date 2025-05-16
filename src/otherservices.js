import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import { otherServicesQuery } from './queries';
import { LoadingContext } from './loadingcontext';
import DataTable from './datatable';

export default function OtherServices() {
  const { sailorType, nameId } = useParams();
  const [data, setData] = useState([]);
  const { data: queryData, status: queryStatus } = useQuery(otherServicesQuery(sailorType, nameId));
  useEffect(() => {
    if(queryStatus === 'success') {
      setData(queryData);
    }
  }, [queryData, queryStatus]);

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: 'fromDate',
      headerName: 'From',
      children: [ { field: 'fromday' }, { field: 'frommonth' }, { field: 'fromyear' } ],
    },
    { groupId: 'toDate',
      headerName: 'To',
      children: [ { field: 'today'   }, { field: 'tomonth'   }, { field: 'toyear'   } ],
    },
  ]

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
      field: 'piece',
      headerName: 'Piece',
      width: 200,
      editable: true,
    },
    {
      field: 'subref',
      headerName: 'Subref/Page',
      width: 200,
      editable: true,
    },
    {
      field: 'ship',
      headerName: 'Ship',
      width: 200,
      editable: true,
    },
    {
      field: 'rating',
      headerName: 'Rank',
      width: 200,
      editable: true,
    },
    {
      field: 'fromday',
      headerName: 'D',
      width: 50,
      editable: true,
    },
    {
      field: 'frommonth',
      headerName: 'M',
      width: 50,
      editable: true,
    },
    {
      field: 'fromyear',
      headerName: 'Y',
      width: 50,
      editable: true,
    },
    {
      field: 'today',
      headerName: 'D',
      width: 50,
      editable: true,
    },
    {
      field: 'tomonth',
      headerName: 'M',
      width: 50,
      editable: true,
    },
    {
      field: 'toyear',
      headerName: 'Y',
      width: 50,
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
          onChange={setData}
          primary='row'
          positionalPrimary
        />
      </LoadingContext>
    );
  }
}
