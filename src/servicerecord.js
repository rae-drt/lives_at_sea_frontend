import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PersonTable from './persontable';
import ServiceReconciler from './servicereconciler';
import PersonControlPanel from './personcontrolpanel';
import { LoadingContext } from './loadingcontext';
import { catref } from './data_utils'

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

export default function ServiceRecord() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const { nameId } = useParams();
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
      document.title = catref(data);
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
    //TODO: Assuming that we get an empty array when there are no service records, and hence can check for length == 0
    const sameServices = serviceRecords.length === 0 ? true : _.isEqual(serviceRecords[1], serviceRecords[2]);
    return (
      <LoadingContext value={fetchingPersonTableData || fetchingServices}>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-around' width={0.95}>
          <ThemeProvider theme={theme}>
            <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={2}>
              <Stack direction='row' width={0.7} alignItems='center'>
                <PersonTable data={personTableData} onChange={setPersonTableData}/>
                <PersonControlPanel
                  data={personTableData}
                  onChange={setPersonTableData}
                  xCheckReady={
                    personTableData.tr1id > 0 &&
                    personTableData.tr2id > 0 &&
                    personTableData.complete1 &&
                    personTableData.complete2 &&
                    sameServices
                  }
                />
              </Stack>
              <ServiceReconciler personTableData={personTableData} setPersonTableData={setPersonTableData} serviceRecords={serviceRecords} setServiceRecords={setServiceRecords}/>
            </Stack>
          </ThemeProvider>
        </Stack>
      </LoadingContext>
    );
  }
}
