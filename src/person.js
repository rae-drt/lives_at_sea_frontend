import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { mainPersonQuery, mainPersonMutate } from './queries';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

const EMPTY_SERVICES = { userid:0, complete:0, records:[] };
const EMPTY_SERVICE_HISTORY = {
  reconciled: false,
  services: [EMPTY_SERVICES, EMPTY_SERVICES],
};

export default function Person() {
  const { sailorType, nameId, dataType } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [personTableData, setPersonTableData] = useState();
  const [serviceRecords, setServiceRecords] = useState(EMPTY_SERVICE_HISTORY);
  const {data: mainPersonQueryData, status: mainPersonQueryStatus} = useQuery(mainPersonQuery(sailorType, nameId));
  const queryClient = useQueryClient();
  useEffect(() => {
    if(mainPersonQueryStatus !== 'success') return;
    const data = mainPersonQueryData;
    if(nameId === '0') {
      document.title = 'New ' + sailorType;
      setPersonTableData(data);
      setServiceRecords(EMPTY_SERVICE_HISTORY);
      return;
    }
    if(sailorType === 'rating') {
      Object.keys(data.name).forEach((k)=>data.name[k] = data.name[k] ? data.name[k] : '');
      setPersonTableData(data.name);
      document.title = catref(data.name);
      if(_.isEmpty(data.service_history)) setServiceRecords(EMPTY_SERVICE_HISTORY);
      else {
        setServiceRecords({reconciled: data.status === 'RECONCILED', services: data.service_history});
      }
    }
    else if(sailorType === 'officer') {
      setPersonTableData(data);
      document.title = 'Officer #' + officerref(data);
    }
    else { throw new Error(); }
  }, [mainPersonQueryData, mainPersonQueryStatus, nameId, sailorType]);
  const theme = createTheme({
    typography: {
      fontSize: 12,
    }
  });

  if(
    (sailorType !== 'rating' && sailorType !== 'officer') ||
    (dataType !== 'main' && dataType !== 'otherservices' && dataType !== 'otherdata')
  ) {
    return (<Alert severity='error'>Bad location: {pathname}</Alert>);
  }
  else if(typeof(personTableData) === 'undefined') {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }
  else if(mainPersonQueryStatus === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else {
    return (
      <LoadingContext value={mainPersonQueryStatus === 'pending'}>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-around' width={0.95}>
          <ThemeProvider theme={theme}>
            <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={2}>
              <Stack direction='row' width={0.7} alignItems='flex-start'>
                <Stack>
                  <PersonTableControlPanel data={personTableData} onChange={(()=>{
                    const payload = sailorType === 'rating' ? {...mainPersonQueryData, name: personTableData} : personTableData;
                    mainPersonMutate(queryClient, sailorType, nameId, payload);
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
              {dataType === 'main' &&          <ServiceReconciler serviceRecords={serviceRecords} setServiceRecords={setServiceRecords}/>}
              {dataType === 'otherservices' && <OtherServices/>}
              {dataType === 'otherdata' &&     <OtherData/>}
            </Stack>
          </ThemeProvider>
        </Stack>
      </LoadingContext>
    );
  }
}
