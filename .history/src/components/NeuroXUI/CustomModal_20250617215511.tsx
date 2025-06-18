import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface CustomModalProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, title, content, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5" color="primary">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2 }}>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
