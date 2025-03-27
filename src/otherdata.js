import { useEffect, useState } from 'react';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
    },
    {
      field: 'subref',
      headerName: 'Piece etc',
      width: 200,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
    },
    {
      field: 'type',
      headerName: 'Data Type',
      width: 200,
    },
    {
      field: 'entry',
      headerName: 'Entry',
      width: 200,
    },
  ];
  return(
    <DataGrid
      rows={otherData}
      columns={columns}
      getRowId = {(row) => {return row.row;}}
    />
  );
}
