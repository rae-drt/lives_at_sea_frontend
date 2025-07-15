import Other from './other';

export default function OtherServices() {
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
  ];

  const columns: GridColDef[] = [
    {
      field: 'row',
      headerName: '#',
      width: 40,
      minWidth: 40,
      align: 'right',
    },
    {
      field: 'sourceid',
      headerName: 'Source',
      flex: 10,
      editable: true,
    },
    {
      field: 'piece',
      headerName: 'Piece',
      flex: 10,
      editable: true,
    },
    {
      field: 'subref',
      headerName: 'Subref/Page',
      flex: 10,
      editable: true,
    },
    {
      field: 'ship',
      headerName: 'Ship',
      flex: 10,
      editable: true,
    },
    {
      field: 'rating',
      headerName: 'Rank',
      flex: 10,
      editable: true,
    },
    {
      field: 'fromday',
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'frommonth',
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'fromyear',
      headerName: 'Y',
      flex: 6,
      editable: true,
    },
    {
      field: 'today',
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'tomonth',
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'toyear',
      headerName: 'Y',
      flex: 6,
      editable: true,
    },
  ];

  return (<Other tag='service_other' columns={columns} columnGroupingModel={columnGroupingModel}/>);
}
