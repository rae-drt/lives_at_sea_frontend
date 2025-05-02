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
import { catref, officerref, RATING_LAYOUT, OFFICER_LAYOUT, init_data } from './data_utils';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

const EMPTY_SERVICES = { userid:0, complete:0, records:[] };
const EMPTY_SERVICE_HISTORY = {
  reconciled: false,
  services: [EMPTY_SERVICES, EMPTY_SERVICES],
};

export default function Person() {
  //TODO: May well make more sense to pass something like a nameid to ServiceTable and let it look up its own transcriber information (and other data)
  //      But this will do for now
  const { sailorType, nameId, dataType } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [personTableData, setPersonTableData] = useState();
  const [serviceRecords, setServiceRecords] = useState(EMPTY_SERVICE_HISTORY);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const fetchData = async() => {
      setFetching(true);
      let data;
      if(nameId === '0') {
        data = init_data(sailorType);
        document.title = 'New ' + sailorType;
        setPersonTableData(data);
      }
      else {
        if(sailorType === 'rating') {
          const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId));
          if(!response.ok) {
            throw new Error('Bad response: ' + response.status);
          }
          data = await(response.json());
          Object.keys(data.name).forEach((k)=>data.name[k] = data.name[k] === null ? '' : data.name[k]);
          document.title = catref(data.name);
          setPersonTableData(data.name);
          if(_.isEmpty(data.service_history)) setServiceRecords(EMPTY_SERVICE_HISTORY);
          else {
            setServiceRecords({reconciled: data.status === 'RECONCILED', services: data.service_history});
          }
        }
        else if(sailorType === 'officer') {
          const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
          socket.onmessage = (e) => {
            if(e.data === 'NULL') {
              throw new Error('Bad response');
            }
            data = JSON.parse(e.data);
            document.title = 'Officer #' + officerref(data);
            setPersonTableData(data);
            socket.close();
          };
          socket.onopen = () => { socket.send('L@S:Officer:' + nameId) };
        }
      }
      setFetching(false);
    }
    fetchData();
  }, [sailorType, nameId]);

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
      <LoadingContext value={fetching}>
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
                  {
                      <PersonTable data={personTableData} onChange={setPersonTableData} rowCells={8}
                        rows={sailorType === 'officer' ?
                          OFFICER_LAYOUT :
                          nameId === '0' ?
                            [{labels: {'ADM': 2}, fields :{series: 1, piece: 1, nameid: 1}}, ...RATING_LAYOUT] :
                            RATING_LAYOUT
                        }
                      />
                  }
                </Stack>
                <PersonControlPanel
                  data={personTableData}
                  onChange={setPersonTableData}
                />
              </Stack>
              <Tabs value={dataType} onChange={(e,v) => {navigate(process.env.PUBLIC_URL + '/' + sailorType + '/' + nameId + '/' + v);}}>
                {sailorType === 'rating' && <Tab value='main' label='Services'/>}
                <Tab value='otherservices' label={sailorType === 'rating' ? 'Other Services' : 'Services'}/>
                <Tab value='otherdata' label='Data'/>
              </Tabs>
              {dataType === 'main' && <ServiceReconciler serviceRecords={serviceRecords} setServiceRecords={setServiceRecords}/>}
              {dataType === 'otherservices' && <OtherServices/>}
              {dataType === 'otherdata' && <OtherData/>}
            </Stack>
          </ThemeProvider>
        </Stack>
      </LoadingContext>
    );
  }
}
