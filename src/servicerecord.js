import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import PersonTable from './persontable';
import ServiceTable from './servicetable';

import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function ServiceRecord() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const [nameId, setNameId] = useState(100000);
  const [personTableData, setPersonTableData] = useState();
  const [serviceRecords, setServiceRecords] = useState([]);
  const [transcription1, setTranscription1] = useState({transcriber: 'Fred Bloggs', complete: true});
  const [transcription2, setTranscription2] = useState({transcriber: 'James Hedgehog', complete: false});
  useEffect(() => {
    const fetchData = async() => {
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      setPersonTableData(data);
    }
    fetchData();
  }, [nameId]);
  useEffect(() => {
    const fetchData = async() => {
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'service?nameid=' + nameId));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      setServiceRecords(data);
    }
    fetchData();
  }, [nameId]);

  const theme = createTheme({
    typography: {
      fontSize: 12,
    }
  });

  return (
    <Stack direction='row' spacing={2}>
      <Stack height='100vh' width={0.4} sx = {{overflow: 'scroll', position: 'sticky', top: '0px'}}>
        <img width='125%' src={process.env.PUBLIC_URL + '/adm/188/506/309728.png'} alt='Microfilm of record 309728 from ADM 188/506'/>
      </Stack>
      <ThemeProvider theme={theme}>
        <Stack width={0.6} sx={{alignItems: 'flex-start', justifyContent: 'space-evenly'}} spacing={2}>
          <Stack direction='row' width={0.9}><PersonTable data={personTableData} onChange={setPersonTableData} nameId={nameId} onChangeNameId={setNameId}/></Stack>
          <Stack direction='row' width={1} sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <ServiceTable transcriptionInfo={transcription1} flipComplete={()=>{setTranscription1({...transcription1, complete: !transcription1.complete})}} data={serviceRecords[1]}/>
            <ServiceTable transcriptionInfo={transcription2} flipComplete={()=>{setTranscription2({...transcription2, complete: !transcription2.complete})}} data={serviceRecords[2]}/>
          </Stack>
        </Stack>
      </ThemeProvider>
    </Stack>
  );
}
