import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import OtherData from './otherdata';
import OtherServices from './otherservices';
import PersonTable from './persontable';
import ServiceReconciler from './servicereconciler';
import PersonControlPanel from './personcontrolpanel';
import PersonTableControlPanel from './persontablecontrolpanel';
import { LoadingContext } from './loadingcontext';
import { catref, officerref, RATING_LAYOUT, OFFICER_LAYOUT } from './data_utils';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

export default function Person() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const { sailorType, nameId, dataType } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [personTableData, setPersonTableData] = useState();
  const [serviceRecords, setServiceRecords] = useState({1:[], 2:[]});
  const [fetchingPersonTableData, setFetchingPersonTableData] = useState(true);
  const [fetchingServices, setFetchingServices] = useState(true);
  useEffect(() => {
    const fetchData = async() => {
      setFetchingPersonTableData(true);
      if(sailorType === 'rating') {
        const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId));
        if(!response.ok) {
          throw new Error('Bad response: ' + response.status);
        }
        const data = await(response.json());
        document.title = catref(data);
        setPersonTableData(data);
      }
      else if(sailorType === 'officer') {
        const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
        socket.onmessage = (e) => {
          if(e.data === 'NULL') {
            throw new Error('Bad response');
          }
          const data = JSON.parse(e.data);
          setPersonTableData(data);
          document.title = 'Officer #' + officerref(data);
          socket.close();
        };
        socket.onopen = () => { socket.send('L@S:Officer:' + nameId) };
      }
      ///*For when there is no network*/ setPersonTableData({"nameid": 0, "series": 188, "piece": 0, "forename": "", "surname": "", "officialnumber": "", "birthday": 0, "birthmonth": 0, "birthyear": 0, "birthplace": "", "birthcounty": "", "occupation": "", "dischargeday": 0, "dischargemonth": 0, "dischargeyear": 0, "dischargereason": "", "tr1id": 0, "complete1": false, "tr2id": 0, "complete2": false, "reconciled": false, "notWW1": false, "error": false});
      setFetchingPersonTableData(false);
    }
    fetchData();
  }, [sailorType, nameId]);
  useEffect(() => {
    const fetchData = async() => {
      setFetchingServices(true);
      const response = await(fetch(process.env.REACT_APP_API_ROOT + 'service?nameid=' + nameId));
      if(!response.ok) {
        throw new Error('Bad response: ' + response.status);
      }
      const data = await(response.json());
      if(_.isEmpty(data)) setServiceRecords({1:[], 2:[]});
      else setServiceRecords(data);
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
  if(
    (sailorType !== 'rating' && sailorType !== 'officer') ||
    (dataType !== 'main' && dataType !== 'otherservices' && dataType !== 'otherdata')
  ) {
    return (<Alert severity='error'>Bad location: {pathname}</Alert>);
  }
  else if(((typeof serviceRecords) === 'undefined') || ((typeof personTableData) === 'undefined')) {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }
  else {
    //TODO: Assuming that we get an empty array when there are no service records, and hence can check for length == 0
    return (
      <LoadingContext value={fetchingPersonTableData || fetchingServices}>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-around' width={0.95}>
          <ThemeProvider theme={theme}>
            <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={2}>
              <Stack direction='row' width={0.7} alignItems='flex-start'>
                <Stack>
                  <PersonTableControlPanel data={personTableData} onChange={(()=>{
                    const response = fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId, {
                      method: "POST",
                      body: JSON.stringify(personTableData),
                    }).then(Function.prototype(),(x)=>{alert(x);}); //SO says that Function.prototype() is a good NOP (https://stackoverflow.com/a/33458430)
                  })}/>
                  <PersonTable data={personTableData} onChange={setPersonTableData} rowCells={8} rows={sailorType === 'officer' ? OFFICER_LAYOUT: RATING_LAYOUT}/>
                </Stack>
                <PersonControlPanel
                  data={personTableData}
                  onChange={setPersonTableData}
                />
              </Stack>
              <Tabs value={dataType} onChange={(e,v) => {navigate('/' + sailorType + '/' + nameId + '/' + v);}}>
                {sailorType === 'rating' && <Tab value='main' label='Services'/>}
                <Tab value='otherservices' label={sailorType === 'rating' ? 'Other Services' : 'Services'}/>
                <Tab value='otherdata' label='Other Data'/>
              </Tabs>
              {dataType === 'main' && <ServiceReconciler personTableData={personTableData} setPersonTableData={setPersonTableData} serviceRecords={serviceRecords} setServiceRecords={setServiceRecords}/>}
              {dataType === 'otherservices' && <OtherServices/>}
              {dataType === 'otherdata' && <OtherData/>}
            </Stack>
          </ThemeProvider>
        </Stack>
      </LoadingContext>
    );
  }
}
