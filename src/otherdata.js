import { useEffect, useState } from 'react';

import DataTable from './datatable';
import { useParams } from 'react-router';

export default function OtherData() {
  const {nameId} = useParams();
  const [otherData, setOtherData] = useState();
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setOtherData([]);
        }
        else {
          setOtherData(JSON.parse(e.data));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:OtherData:' + nameId) };
    };
    fetchData();
  }, [nameId]);

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
  return(
    <DataTable
      rows={otherData}
      columns={columns}
      columnGroupingModel={columnGroupingModel}
      onChange={setOtherData}
      disableColumnSorting={false}
    />
  );
}
