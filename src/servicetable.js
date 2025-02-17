import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

//Begin dummy data
function createData(
  ship: string,
  rating: string,
  fromDate: Date,
  toDate: Date,
) {
  return { ...{id: createData.id++}, ship, rating, fromDate, toDate }
}
createData.id = 1
//NB This style of Date constructor takes Year, Month, Day, with months (only) counting from 0
const rows = [
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
];
//End dummy data


const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'fromDate',
    headerName: 'From',
    children: [ { field: 'fromDay' }, { field: 'fromMonth' }, { field: 'fromYear' } ],
  },
  { groupId: 'toDate',
    headerName: 'To',
    children: [ { field: 'toDay'   }, { field: 'toMonth'   }, { field: 'toYear'   } ],
  },
]

function daysInMonth(month: number, year: number) { //1-indexed month i.e. January is 1. Needs the year because of leap years.
  console.log(month, year)
  //date takes 0-indexed month, so we've effectively already moved to the next month (e.g. Feb becomes March)
  //and then day 0 of a month is the final day of the previous month
  return new Date(year, month, 0).getDate()
}

//Converts a string input to an integer, then checks that that integer falls within a number range
function isIntInRange(value: string, min: number, max: number) {
  value = parseFloat(value, 10); //must use parseFloat here -- parseInt will truncate a float to an int, instead of failing
  if(!Number.isInteger(value)) return false; //will also return false for NaN
  return value >= min && value <= max;
}

function dateColumns(prefix: string) {
  return [
    {
      field: prefix + 'Day',
      headerName: 'D',
      editable: true,
      valueGetter: (value, row) => `${row[prefix + 'Date'].getDate()}`,
      valueSetter: (value, row) =>  {
        const date = row[prefix + 'Date']
        if(isIntInRange(value, 1, daysInMonth(date.getMonth() + 1, date.getFullYear()))) row[prefix + 'Date'].setDate(value);
        return row;
      },
    },
    {
      field: prefix + 'Month',
      headerName: 'M',
      editable: true,
      valueGetter: (value, row) => `${row[prefix + 'Date'].getMonth() + 1}`,
      valueSetter: (value, row) =>  {
        if(isIntInRange(value, 1, 12)) row[prefix + 'Date'].setMonth(value - 1);
        return row;
      },
    },
    {
      field: prefix + 'Year',
      headerName: 'Y',
      editable: true,
      valueGetter: (value, row) => `${row[prefix + 'Date'].getFullYear()}`,
      valueSetter: (value, row) =>  {
        if(isIntInRange(value, 1800, 1999)) row[prefix + 'Date'].setFullYear(value)
        return row;
      },
    },
  ]
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Row'
  },
  {
    field: 'ship',
    headerName: 'Ship',
    editable: true,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    editable: true,
  },
].concat(dateColumns('from')).concat(dateColumns('to'))
console.log(columns)

export default function ServiceTable() {
  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableColumnSorting
        disableColumnMenu
        columnGroupingModel={columnGroupingModel}
      />
    </Box>
  );
}
