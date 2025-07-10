import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function BlockNavigationDialog({blocker}) {
  return (
    <Dialog open={blocker.state === 'blocked'}>
      <DialogTitle>Unsaved changes</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{marginBottom: 2}}>
          This record contains unsaved changes. Are you sure you want to leave without saving?
        </DialogContentText>
        <DialogContentText sx={{marginBottom: 2}}>
          Unsaved changes will be kept for the remainder of this session.
        </DialogContentText>
        <DialogActions>
          <Button autoFocus onClick={()=>{blocker.reset()}}>Remain on this page</Button>
          <Button onClick={()=>{blocker.proceed()}}>Leave this page</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
