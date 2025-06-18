    import React from 'react';
    import {
    Modal,
    Box,
    Typography,
    IconButton,
    Button,
    Link,
    Stack,
    Divider
    } from '@mui/material';
    import CloseIcon from '@mui/icons-material/Close';
    import WhatsAppIcon from '@mui/icons-material/WhatsApp';
    import logosegundario from '../../assets/logosegundario.png';
    import whatsapp from '../../assets/whatsapp.svg';

    interface ContactModalProps {
    open: boolean;
    onClose: () => void;
    }

    const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: '#fff3e0',
            border: '4px solid #2C6D3D',
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            }}
        >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
            <img src={logosegundario} alt="Logo" style={{ width: 100, marginBottom: 16 }} />

            <Typography variant="h5" sx={{ color: '#2C6D3D', fontWeight: 'bold', mb: 2 }}>
                Contáctanos
            </Typography>

            <Typography sx={{ mb: 2 }}>
                ¿Necesitas ayuda? Estamos aquí para ti. Puedes escribirnos un correo o enviarnos un mensaje directo por WhatsApp.
            </Typography>

            <Stack spacing={1} sx={{ mb: 3, textAlign: 'left' }}>
                <Typography>
                <strong>Correo:</strong>{' '}
                <Link href="mailto:info@renovamind.com" underline="hover" color="primary">
                    info@renovamind.com
                </Link>
                </Typography>
                <Typography>
                <strong>Teléfono:</strong> 415-1880
                </Typography>
            </Stack>

            <Button
                variant="outlined"
                color="success"
                href="https://wa.link/4bv4ea"
                target="_blank"
                startIcon={<img src={WhatsAppIcon} alt="WhatsApp" style={{ width: 24 }} />}
                sx={{ mb: 2 }}
            >
                Habla con nosotros
            </Button>

            <Divider sx={{ mb: 2 }} />

            <Button variant="contained" onClick={onClose}>
                Cerrar
            </Button>
            </Box>
        </Box>
        </Modal>
    );
    };

    export default ContactModal;
