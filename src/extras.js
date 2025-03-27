import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';

import OtherData from './otherdata';
import OtherServices from './otherservices';

export default function Extras() {
  const [tabIndex, setTabIndex] = useState(0);
  const {state} = useLocation();
  const data = state;
  const birthDate = new Date(data.birthday, data.birthmonth, data.birthyear);
  const dischargeDate = new Date(data.dischargeday, data.dischargemonth, data.dischargeyear);
  return(
    <Box>
      <Typography align='left'>
        Records for {data.forename} {data.surname}, service number: {data.officialnumber}, born: {new Intl.DateTimeFormat('en-GB', {dateStyle: 'full'}).format(birthDate)} at {data.birthplace}, {data.birthcounty}, discharged: {new Intl.DateTimeFormat('en-GB', {dateStyle: 'full'}).format(dischargeDate)}
      </Typography>
      <Tabs value={tabIndex} onChange={(e, v) => { setTabIndex(v); }}>
        <Tab label='Data'/>
        <Tab label='Services'/>
      </Tabs>
      { tabIndex === 0 ?
        <OtherData/> :
        <OtherServices/>
      }
    </Box>
  );
}
