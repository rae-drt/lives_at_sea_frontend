import { useState, useContext } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router';
import { LoadingContext } from './loadingcontext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/List';

import PersonTable from './persontable';

import { useEffect } from 'react';

import {RATING_FIELDS, RATING_LAYOUT, OFFICER_FIELDS, OFFICER_LAYOUT, convert_to_date} from './data_utils';

const _ = require('lodash');

function initData(type) {
  if(type === 'rating') {
    return RATING_FIELDS.reduce((a, b) => ({ ...a, [b]: ''}), {series: '', piece: '', nameid: ''});
  }
  else {
    return OFFICER_FIELDS.reduce((a, b) => ({...a, [b]: ''}), {});
  }
}

export default function DataTable(props) {
  const navigate = useNavigate();
  const {sailorType} = useParams();
  const loading = useContext(LoadingContext);
  const [data, setData] = useState(initData(sailorType));
  const [identifiers, setIdentifiers] = useState([]);

  function searchFunction(params) {
    const strippedData = structuredClone(data);
    for(let prop in strippedData) {
      if(sailorType === 'rating') {
        if(!RATING_FIELDS.includes(prop)) {
          delete strippedData[prop];
          continue;
        }
      }
      else if(sailorType === 'officer') {
        if(!OFFICER_FIELDS.includes(prop)) {
          delete strippedData[prop];
          continue;
        }
      }
      if(!strippedData[prop]) delete strippedData[prop];
    }
    if(sailorType === 'officer') {
      convert_to_date(strippedData, 'birthday', 'birthmonth', 'birthyear');
    }
    if(_.isEmpty(strippedData)) {
      setIdentifiers([]);
    }
    else {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setIdentifiers([]);
        }
        else {
          setIdentifiers(JSON.parse(e.data));
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:Search:' + sailorType + ':' + new URLSearchParams(strippedData).toString()) };
    }
  }

  const list = [];
  for(const identifier of identifiers) {
    list.push(<ListItem key={identifier}><Link target='_blank' href={process.env.PUBLIC_URL + '/' + sailorType + '/' + identifier}>{identifier}</Link></ListItem>);
  }

  return(
    <LoadingContext value={false}>
      <Card>
        <CardContent>
          <Stack direction='row' justifyContent='space-between'>
            <RadioGroup
              value={sailorType}
              onChange={(e)=>{navigate('/search/' + e.target.value);setIdentifiers([]);setData(initData(e.target.value));}}
              row
            >
              <FormControlLabel value="rating"  control={<Radio/>} label="Ratings" />
              <FormControlLabel value="officer" control={<Radio/>} label="Officers" />
            </RadioGroup>
            <Button onClick={searchFunction}>Search</Button>
          </Stack>
        </CardContent>
      </Card>
      <PersonTable data={data} onChange={setData} onButton={searchFunction} rowCells={8}
                   rows={sailorType === 'officer' ? OFFICER_LAYOUT : [{labels: {'ADM': 2}, fields: {series: 1, piece: 1, nameid: 1}}, ...RATING_LAYOUT]}
      />
      <List>
        {list}
      </List>
      <Outlet/>
    </LoadingContext>
  );
}
