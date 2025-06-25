// src/pages/USER/Estadisticas/Resumen/ResumenComparativo.tsx
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { getPacientePorUsuario } from '../../../../services/ApiService';

interface Sesion {
    id: number;
    date: string;
    result: number;
    sessionDurationSeconds: number;
    mode?: string;
    status: string;
}

interface Patient {
    firstname: string;
    secondname: string;
    surname: string;
    age: number;
    gender: string;
}

interface Props {
    sesiones: Sesion[];
}

const ResumenComparativo: React.FC<Props> = ({ sesiones }) => {
    const [paciente, setPaciente] = useState<Patient | null>(null);
    const userId = localStorage.getItem('userId');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (userId) {
            getPacientePorUsuario(userId)
                .then(res => setPaciente(res.data))
                .catch(err => console.error('Error al obtener paciente', err));
        }
    }, [userId]);

    if (sesiones.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No hay sesiones para comparar.
                </Typography>
            </Box>
        );
    }

    const promedioTotal = Math.round(
        sesiones.reduce((acc, s) => acc + (s.result ?? 0), 0) / sesiones.length
    );

    const promedioTiempo = Math.round(
        sesiones.reduce((acc, s) => acc + (s.sessionDurationSeconds ?? 0), 0) / sesiones.length
    );

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica');
        doc.setFontSize(20);
        doc.setTextColor(theme.palette.primary.main);
        doc.text("Informe Comparativo de Sesiones", 14, 20);

        if (paciente) {
            doc.setFillColor(230, 240, 255);
            doc.roundedRect(14, 25, 180, 35, 5, 5, 'F');

            doc.setFontSize(12);
            doc.setTextColor('#0d47a1');
            doc.text(`Paciente: ${paciente.firstname} ${paciente.secondname} ${paciente.surname}`, 20, 40);
            doc.text(`Edad: ${paciente.age} años`, 20, 48);
            doc.text(`Género: ${paciente.gender}`, 20, 56);
        }

        doc.setTextColor('#000000');
        doc.setFontSize(14);
        doc.text(`Promedio Resultados: ${promedioTotal} puntos`, 14, 70);
        doc.text(`Duración promedio por sesión: ${promedioTiempo} segundos`, 14, 78);

        const tableColumn = ["Fecha", "Resultado", "Duración (s)", "Modo", "Estado"];
        const tableRows = sesiones.map(s => [
            new Date(s.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            Math.round(s.result ?? 0),
            s.sessionDurationSeconds ?? "-",
            s.mode ?? "-",
            s.status,
        ]);

        autoTable(doc, {
            startY: 85,
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
        });

        doc.save("ResumenComparativo.pdf");
    };

    return (
        <Box
            sx={{

                width: '100%',
                minHeight: '45vh',
                mx: 'auto',
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[4],
                p: isMobile ? 2 : 4,
                m: '2rem auto',
                userSelect: 'none',
            }}
        >
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h2"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.text.primary,
                    letterSpacing: 0.5,
                    textAlign: 'center',
                    userSelect: 'none',
                }}
            >
                📤 Resumen Comparativo
            </Typography>

            {paciente && (
                <Box sx={{ mb: 3, textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Paciente:
                        <Typography
                            component="span"
                            sx={{ ml: 1, fontWeight: 400, color: theme.palette.text.primary }}
                        >
                            {`${paciente.firstname} ${paciente.secondname} ${paciente.surname}`}
                        </Typography>
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Edad:
                        <Typography component="span" sx={{ ml: 1, fontWeight: 400, color: theme.palette.text.primary }}>
                            {`${paciente.age} años`}
                        </Typography>
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Género:
                        <Typography component="span" sx={{ ml: 1, fontWeight: 400, color: theme.palette.text.primary }}>
                            {paciente.gender}
                        </Typography>
                    </Typography>
                </Box>
            )}

            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                Promedio de resultados: <Typography component="span" sx={{ fontWeight: 400 }}>{promedioTotal} puntos</Typography>
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
                Duración promedio por sesión: <Typography component="span" sx={{ fontWeight: 400 }}>{promedioTiempo} segundos</Typography>
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 400,
                    overflowX: 'auto',
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                }}
            >
                <Table stickyHeader size={isMobile ? 'small' : 'medium'} aria-label="tabla comparativa sesiones">
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Fecha</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Resultado</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Duración (s)</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Modo</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sesiones.map((s) => (
                            <TableRow
                                key={s.id}
                                sx={{
                                    bgcolor: s.id % 2 === 0 ? theme.palette.action.hover : 'inherit',
                                    '&:hover': {
                                        bgcolor: theme.palette.action.selected,
                                        boxShadow: `0 4px 15px ${theme.palette.primary.light}`,
                                        cursor: 'default',
                                    },
                                }}
                            >
                                <TableCell align="center">
                                    {new Date(s.date).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </TableCell>
                                <TableCell align="center">{Math.round(s.result ?? 0)}</TableCell>
                                <TableCell align="center">{s.sessionDurationSeconds ?? 'N/A'}</TableCell>
                                <TableCell align="center">{s.mode ?? 'N/A'}</TableCell>
                                <TableCell align="center">{s.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={exportPDF}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 700,
                        letterSpacing: 0.05,
                        boxShadow: theme.shadows[5],
                        '&:hover': {
                            boxShadow: theme.shadows[10],
                        },
                        userSelect: 'none',
                    }}
                >
                    📄 Exportar a PDF
                </Button>
            </Box>
        </Box>
    );
};

export default ResumenComparativo;
