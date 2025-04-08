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
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { LoadingContext } from './loadingcontext';
import { catref } from './data_utils'

import { ThemeProvider, createTheme } from '@mui/material/styles';

const _ = require('lodash');

export default function PersonTableControlPanel({data}) {
  return (
    <Card>
      <CardContent>
        <Stack direction='row' justifyContent='space-between' spacing={2}>
          <Typography variant='h6'>{catref(data)}</Typography>
          <Stack direction='row' spacing={2}>
            <FormControlLabel control={<Checkbox checked={data.error} disabled={true}/>} label='Error?' labelPlacement='start'/>
            <Button variant='outlined' onClick={()=>{alert('clicked')}}>Enter</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
