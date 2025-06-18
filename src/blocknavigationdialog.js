import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

export default function BlockNavigationDialog({blocker}) {
  return (
    <Dialog open={blocker.state === 'blocked'}>
      <DialogTitle>Discard changes?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{marginBottom: 2}}>
          Are you sure you want to leave this record?
        </DialogContentText>
        <DialogContentText sx={{marginBottom: 2}}>
          There are unsaved changes that will be lost if you leave this page without pressing Enter.
        </DialogContentText>
        <DialogActions>
          <Button autoFocus onClick={()=>{blocker.reset()}}>Continue editing</Button>
          <Button onClick={()=>{blocker.proceed()}}>Discard changes</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
