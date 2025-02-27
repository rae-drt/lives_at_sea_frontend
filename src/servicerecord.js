import { useState } from 'react';
import Stack from '@mui/material/Stack';
import PersonTable from './persontable';
import ServiceTable from './servicetable';

//Begin dummy data
function createPersonTableData(
  forename: string[],
  surname: string,
  number: number,
  birthDate: Date,
  birthPlace: string,
  birthCounty: string,
  occupation: string,
  dischargeDate: Date,
  dischargeReason: string,
) {
  return { forename, surname, number, birthDate, birthPlace, birthCounty, occupation, dischargeDate, dischargeReason }
}

const personTableData = createPersonTableData(
  'Richard John', 'Bishop',
  309728,
  new Date(1884, 3, 20),
  'Walworth', 'London',
  'Porter',
  new Date(1928, 2, 19), 'Pensioned',
)

function createServiceTableData(
  ship: string,
  rating: string,
  fromDate: Date,
  toDate: Date,
) {
  return { ...{id: createServiceTableData.id++}, ship, rating, fromDate, toDate }
}
createServiceTableData.id = 1
//NB This style of Date constructor takes Year, Month, Day, with months (only) counting from 0
const serviceTableData = [
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
  createServiceTableData('Cressy',  'Sto 2C', new Date(1907, 10, 17), new Date(1907,  0, 29)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1907,  0, 30), new Date(1907,  1, 12)),
  createServiceTableData('Nelson',  'Sto 2C', new Date(1906,  1, 20), new Date(1906,  5,  8)),
  createServiceTableData('Latona',  'Sto 2C', new Date(1906,  5,  9), new Date(1906,  9,  1)),
  createServiceTableData('Victory', 'Sto 2C', new Date(1906,  9,  2), new Date(1906, 10, 16)),
];
//End dummy data

export default function ServiceRecord() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const [transcription1, setTranscription1] = useState({transcriber: 'Fred Bloggs', complete: true});
  const [transcription2, setTranscription2] = useState({transcriber: 'James Hedgehog', complete: false});
  return (
    <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={2}>
      <Stack direction='row' width={0.75}><PersonTable data={personTableData}/></Stack>
      <Stack direction='row' width={1.00} sx={{justifyContent: 'space-evenly'}}>
        <ServiceTable transcriptionInfo={transcription1} flipComplete={()=>{setTranscription1({...transcription1, complete: !transcription1.complete})}} data={serviceTableData}/>
        <ServiceTable transcriptionInfo={transcription2} flipComplete={()=>{setTranscription2({...transcription2, complete: !transcription2.complete})}} data={serviceTableData}/>
      </Stack>
    </Stack>
  );
}
