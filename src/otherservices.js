import { useEffect, useState } from 'react';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router';

export default function OtherServices() {
  const {nameId} = useParams();
  const [otherServices, setOtherServices] = useState();
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        console.log(e.data);
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
  console.log(otherServices);

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
      field: 'piece',
      headerName: 'Piece',
      width: 200,
    },
    {
      field: 'subref',
      headerName: 'Subref/Page',
      width: 200,
    },
    {
      field: 'ship',
      headerName: 'Ship',
      width: 200,
    },
    {
      field: 'rating',
      headerName: 'Rank',
      width: 200,
    },
    {
      field: 'fromdate',
      headerName: 'From',
      width: 200,
    },
    {
      field: 'todate',
      headerName: 'To',
      width: 200,
    },
  ];
  return(
    <DataGrid
      rows={otherServices}
      columns={columns}
      getRowId = {(row) => {return row.row;}}
    />
  );
}
