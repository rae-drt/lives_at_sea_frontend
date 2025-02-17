import Stack from '@mui/material/Stack';
import PersonTable from './persontable';
import ServiceTable from './servicetable';

export default function ServiceRecord() {
  return (
    <Stack sx={{alignItems: 'center', justifyContent: 'space-evenly'}} spacing={2}>
      <Stack direction='row' width={0.75}><PersonTable/></Stack>
      <Stack direction='row' width={1.00} sx={{justifyContent: 'space-evenly'}}><ServiceTable/><ServiceTable/></Stack>
    </Stack>
  );
}
