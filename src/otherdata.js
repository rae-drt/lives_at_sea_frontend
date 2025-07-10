import Other from './other';

export default function OtherData() {
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
      headerName: 'D',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'month',
      headerName: 'M',
      flex: 4,
      minWidth: 40,
      editable: true,
    },
    {
      field: 'year',
      headerName: 'Y',
      flex: 6,
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
