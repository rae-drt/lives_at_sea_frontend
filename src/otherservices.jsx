import Other from './other';

export default function OtherServices({record}) {
  const columnGroupingModel = [
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

  const columns = [
    {
      field: 'row',
      headerName: '#',
      width: 40,
      minWidth: 40,
      align: 'right',
    },
    {
      field: 'reference',
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
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      align: 'right',
      editable: true,
    },
    {
      field: 'frommonth',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      align: 'right',
      editable: true,
    },
    {
      field: 'fromyear',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'Y',
      flex: 6,
      align: 'right',
      editable: true,
    },
    {
      field: 'today',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      align: 'right',
      editable: true,
    },
    {
      field: 'tomonth',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      align: 'right',
      editable: true,
    },
    {
      field: 'toyear',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'Y',
      flex: 6,
      align: 'right',
      editable: true,
    },
  ];

  return (<Other tag='service_other' columns={columns} columnGroupingModel={columnGroupingModel} record={record}/>);
}
