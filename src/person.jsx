import { useParams, useLocation, useNavigate } from 'react-router';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import OtherData from './otherdata';
import OtherServices from './otherservices';
import PersonTable from './persontable';
import ServiceReconciler from './servicereconciler';
import NewPersonControlPanel from './newpersoncontrolpanel';
import ExistingPersonControlPanel from './existingpersoncontrolpanel';
import PersonTableControlPanel from './persontablecontrolpanel';
import { LoadingContext } from './loadingcontext';
import { DirtySailorContext, useDirtySailor, useDirtySailorBlocker } from './dirty';
import BlockNavigationDialog from './blocknavigationdialog';
import { catref, officerref, RATING_LAYOUT, OFFICER_LAYOUT } from './data_utils';
import { useRecord } from './queries';

function isNew(id) {
  return id === '0';
}

export default function Person() {
  const { sailorType, nameId, dataType } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: personTableData, setData: setPersonTableData, mutateData: mutatePersonTableData, status: mainPersonQueryStatus } = useRecord(sailorType, nameId, 'name');
  const dirty = useDirtySailor(sailorType, nameId);
  const blocker = useDirtySailorBlocker(dirty);

  if(isNew(nameId)) document.title = 'New ' + sailorType;
  else if(personTableData) {
    if(sailorType === 'rating') document.title = catref(personTableData);
    else if(sailorType === 'officer') document.title = 'Officer #' + officerref(personTableData);
    else throw new Error(); //this should never happen
  }
  else document.title = 'Fetching ' + sailorType + ' ' + nameId;

  if(
    (sailorType !== 'rating' && sailorType !== 'officer') ||
    (dataType !== 'main' && dataType !== 'otherservices' && dataType !== 'otherdata')
  ) {
    return (<Alert severity='error'>Bad location: {pathname}</Alert>);
  }
  else if(mainPersonQueryStatus === 'error') {
    return (<Alert severity='error'>Error fetching data</Alert>);
  }
  else if(mainPersonQueryStatus === 'pending') {
    return (<Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'><CircularProgress size='50vh'/></Stack>);
  }
  else {
    const controlPanel = isNew(nameId) ?
      <NewPersonControlPanel data={personTableData} onChange={setPersonTableData}/>
      :
      <ExistingPersonControlPanel data={personTableData} onChange={setPersonTableData}/>;
    return (
      <LoadingContext value={mainPersonQueryStatus === 'pending'}>
        <DirtySailorContext value={dirty}>
          <BlockNavigationDialog blocker={blocker}/>
          <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-around' width={0.95}>
            <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={4}>
              <Stack direction='row' width={0.9} alignItems='flex-start'>
                <Card variant='outlined'>
                  <PersonTableControlPanel data={personTableData} onChange={(()=>{
                    mutatePersonTableData(personTableData);
                  })}/>
                  {
                    <PersonTable data={personTableData} onChange={setPersonTableData} rowCells={8}
                      rows={sailorType === 'officer' ?
                        OFFICER_LAYOUT :
                        isNew(nameId) ?
                          [{labels: {'ADM': 2}, fields :{series: 1, piece: 1, nameid: 1}}, ...RATING_LAYOUT] :
                          RATING_LAYOUT
                      }
                    />
                  }
                </Card>
                {controlPanel}
              </Stack>
              <Stack alignItems='center' spacing={2} width='95vw'>
                <Tabs value={dataType} onChange={(e,v) => {navigate('/person/' + sailorType + '/' + nameId + '/' + v);}}>
                  {sailorType === 'rating' && <Tab value='main' label='Services' sx={((dataType !== 'main') && dirty.service) ? { fontWeight: 'bold' } : null }/>}
                  <Tab value='otherservices' label={sailorType === 'rating' ? 'Other Services' : 'Services'}  sx={((dataType !== 'otherservices') && dirty.service_other) ? { fontWeight: 'bold' } : null }/>
                  <Tab value='otherdata' label='Data' sx={((dataType !== 'otherdata') && dirty.data_other) ? { fontWeight: 'bold' } : null }/>
                </Tabs>
                <Card variant='outlined'>
                  {dataType === 'main' &&          <ServiceReconciler/>}
                  {dataType === 'otherservices' && <OtherServices/>}
                  {dataType === 'otherdata' &&     <OtherData/>}
                </Card>
              </Stack>
            </Stack>
          </Stack>
        </DirtySailorContext>
      </LoadingContext>
    );
  }
}
