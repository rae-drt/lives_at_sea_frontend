import Other from './other';

export default function OtherData() {
  const columnGroupingModel = [
    {
      groupId: 'date',
      headerName: 'Date',
      children: [ { field: 'day' }, { field: 'month' }, { field: 'year' } ],
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
      field: 'sourceid',
      headerName: 'Source',
      flex: 10,
      editable: true,
    },
    {
      field: 'subref',
      headerName: 'Piece etc',
      flex: 10,
      editable: true,
    },
    {
      field: 'day',
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
      field: 'month',
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
      field: 'year',
      type: 'number',
      valueFormatter: (v) => v, //prevent clever number formatting (e.g. comma as 1000s separator is unhelpful here)
      valueGetter: (v) => v === null ? 0 : v, //render null as 0. Would be better to store as 0, but we'll catch it in data normalization when we post
      headerName: 'Y',
      flex: 6,
      align: 'right',
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Data Type',
      flex: 10,
      editable: true,
    },
    {
      field: 'entry',
      headerName: 'Entry',
      flex: 10,
      editable: true,
    },
  ];

  return (<Other tag='data_other' columns={columns} columnGroupingModel={columnGroupingModel}/>);
}
