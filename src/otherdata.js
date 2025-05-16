import { otherDataQuery } from './queries';
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

  return (<Other query={otherDataQuery} columns={columns} columnGroupingModel={columnGroupingModel}/>);
}
