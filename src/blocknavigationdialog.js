import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function BlockNavigationDialog({blocker}) {
  return (
    <Dialog open={blocker.state === 'blocked'}>
      <DialogTitle>Discard changes?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to leave this record?
          You have unsaved changes that will be lost if you navigate away.
        </DialogContentText>
        <DialogActions>
          <Button onClick={()=>{blocker.reset()}}>Continue editing this record</Button>
          <Button onClick={()=>{blocker.proceed()}}>Discard changes</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
