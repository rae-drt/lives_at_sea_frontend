import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PersonTable from './persontable';
import ServiceTable from './servicetable';
import PersonControlPanel from './personcontrolpanel';
import { LoadingContext } from './loadingcontext';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

export default function ServiceRecord() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const [nameId, setNameId] = useState(40001); //lowest nameid as default
  const [personTableData, setPersonTableData] = useState();
  const [serviceRecords, setServiceRecords] = useState([]);
  const [fetchingPersonTableData, setFetchingPersonTableData] = useState(true);
  const [fetchingServices, setFetchingServices] = useState(true);
  useEffect(() => {
    const fetchData = async() => {
      setFetchingPersonTableData(true);
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      setPersonTableData(data);
      ///*For when there is no network*/ setPersonTableData({"nameid": 0, "series": 188, "piece": 0, "forename": "", "surname": "", "officialnumber": "", "birthday": 0, "birthmonth": 0, "birthyear": 0, "birthplace": "", "birthcounty": "", "occupation": "", "dischargeday": 0, "dischargemonth": 0, "dischargeyear": 0, "dischargereason": "", "tr1id": 0, "complete1": false, "tr2id": 0, "complete2": false, "reconciled": false, "notWW1": false, "error": false});
      setFetchingPersonTableData(false);
    }
    fetchData();
  }, [nameId]);
  useEffect(() => {
    const fetchData = async() => {
      setFetchingServices(true);
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'service?nameid=' + nameId));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      setServiceRecords(data);
      // /*For when there is no network*/ setServiceRecords({});
      setFetchingServices(false);
    }
    fetchData();
  }, [nameId]);

  const theme = createTheme({
    typography: {
      fontSize: 12,
    }
  });

  //I think this will only occur during initial load
  if(((typeof serviceRecords) === 'undefined') || ((typeof personTableData) === 'undefined')) {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }
  else {
    return (
      <LoadingContext value={fetchingPersonTableData || fetchingServices}>
        <Stack direction='row' spacing={2}>
          <Stack height='100vh' width={0.4} sx = {{overflow: 'scroll', position: 'sticky', top: '0px'}}>
            <img width='125%' src={process.env.PUBLIC_URL + '/adm/188/506/309728.png'} alt='Microfilm of record 309728 from ADM 188/506'/>
          </Stack>
          <ThemeProvider theme={theme}>
            <Stack width={0.6} sx={{alignItems: 'flex-start', justifyContent: 'space-evenly'}} spacing={2}>
              <Stack direction='row' width={0.9}>
                <PersonTable data={personTableData} onChange={setPersonTableData}/>
                <PersonControlPanel data={personTableData} onChange={setPersonTableData} nameId={nameId} onChangeNameId={setNameId} serviceEquality={_.isEqual(serviceRecords[1], serviceRecords[2])}/>
              </Stack>
              <Stack direction='row' width={1} sx={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <ServiceTable transcriber={personTableData.tr1id} complete={personTableData.complete1} flipComplete={()=>{setPersonTableData({...personTableData, complete1: !personTableData.complete1})}} data={serviceRecords[1]} onChange={(d)=>{setServiceRecords({1: d, 2: structuredClone(serviceRecords[2])});}}/>
                <ServiceTable transcriber={personTableData.tr2id} complete={personTableData.complete2} flipComplete={()=>{setPersonTableData({...personTableData, complete2: !personTableData.complete2})}} data={serviceRecords[2]} onChange={(d)=>{setServiceRecords({1: structuredClone(serviceRecords[1]), 2: d});}}/>
              </Stack>
            </Stack>
          </ThemeProvider>
        </Stack>
      </LoadingContext>
    );
  }
}
