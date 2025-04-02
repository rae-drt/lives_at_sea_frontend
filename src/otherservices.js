import { useEffect, useState } from 'react';

import DataTable from './datatable';
import { useParams } from 'react-router';

export default function OtherServices() {
  const {nameId} = useParams();
  const [otherServices, setOtherServices] = useState();
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setOtherServices([]);
        }
        else {
          setOtherServices(JSON.parse(e.data));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:OtherServices:' + nameId) };
    };
    fetchData();
  }, [nameId]);

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
  return(
    <DataTable
      rows={otherServices}
      columns={columns}
      columnGroupingModel={columnGroupingModel}
      onChange={setOtherServices}
      disableColumnSorting={false}
    />
  );
}
