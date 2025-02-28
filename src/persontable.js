import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function PersonTable({data}) {
  return (
    <Card>
      <CardContent>
        <Grid container columns={7}>
          <Grid size={1} container alignItems='center'><Typography>Forename, surname</Typography></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.forename}/></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.surname}/></Grid>
          <Grid size={0}/>{ /*!-- Empty element to align row*/ }

          <Grid size={1} container alignItems='center'><Typography>Official number</Typography></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.number}/></Grid>
          <Grid size={3}/>{ /*!-- Empty element to align row*/ }

          <Grid size={1} container alignItems='center'><Typography>Born</Typography></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getDate()}/></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getMonth() + 1}/></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.birthDate.getFullYear()}/></Grid>
          <Grid size={3}/>{ /*!-- Empty element to align row*/ }

          <Grid size={1} container alignItems='center'><Typography>Birth place, county</Typography></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.birthPlace}/></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.birthCounty}/></Grid>
          <Grid size={0}/>{ /*!-- Empty element to align row*/ }

          <Grid size={1} container alignItems='center'><Typography>Occupation</Typography></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.occupation}/></Grid>
          <Grid size={3}/>{ /*!-- Empty element to align row*/ }

          <Grid size={1} container alignItems='center'><Typography>Discharge date, reason</Typography></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getDate()}/></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getMonth() + 1}/></Grid>
          <Grid size={1}><TextField fullWidth defaultValue= {data.dischargeDate.getFullYear()}/></Grid>
          <Grid size={3}><TextField fullWidth defaultValue= {data.dischargeReason}/></Grid>
          <Grid size={0}/>{ /*!-- Empty element to align row*/ }
        </Grid>
      </CardContent>
    </Card>
  );
}
