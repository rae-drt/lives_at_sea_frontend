import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { surname_officerref } from './data_utils';

export default function OfficerIndex() {
  const { letter } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async() => {
      const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
      socket.onmessage = (e) => {
        if(e.data === 'NULL') {
          setData([]);
        }
        else {
          const data = JSON.parse(e.data);
          setData(data);
        }
        socket.close();
      };
      socket.onopen = () => { socket.send('L@S:OfficerNames:' + letter) };
    }
    fetchData();
  }, [letter]);

  const list = [];
  if(data !== null) {
    for(const datum of data) {
      list.push(<ListItem key={datum.nameid}><Link href={process.env.PUBLIC_URL + '/officer/' + datum.nameid + '/otherservices'}>{surname_officerref(datum)}</Link></ListItem>);
    }
  }
  return (
    <>
      <Tabs value={letter} onChange={(e,v) => {setData(null); navigate(process.env.PUBLIC_URL + '/officers/' + v)}}>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='A' label='A'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='B' label='B'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='C' label='C'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='D' label='D'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='E' label='E'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='F' label='F'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='G' label='G'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='H' label='H'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='I' label='I'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='J' label='J'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='K' label='K'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='L' label='L'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='M' label='M'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='N' label='N'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='O' label='O'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='P' label='P'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='Q' label='Q'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='R' label='R'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='S' label='S'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='T' label='T'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='U' label='U'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='V' label='V'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='W' label='W'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='X' label='X'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='Y' label='Y'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='Z' label='Z'/>
        <Tab sx={{minWidth: '2em', paddingInline: '1em'}} value='null' label='null'/>
      </Tabs>
      { data === null ? 
          <CircularProgress size='50vh'/> : 
          list.length === 0 ?
            <Typography>No officer surnames for "{letter}"</Typography> :
            <List sx={{display: 'flex', width: '30em', height: '90vh', flexFlow: 'column wrap'}}>{list}</List>
      }
    </>
  );
}
