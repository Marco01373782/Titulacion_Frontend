    // src/estadisticas/ActivityResultTable.tsx
    import React from 'react';
    import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    useTheme,
    useMediaQuery,
    } from '@mui/material';

    interface ActivityResult {
    activity: {
        id: number;
    };
    result?: number;
    durationSeconds?: number;
    completedAt?: string;
    }

    interface Props {
    results: ActivityResult[];
    }

    const ActivityResultTable: React.FC<Props> = ({ results }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
        sx={{
            width: '100%',
            height: '100%',
            overflowX: 'auto',
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[2],
            p: 2,
        }}
        >
        <Table
            stickyHeader
            aria-label="Resultados de actividades"
            sx={{
            minWidth: 350,
            '& th': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 'bold',
                fontSize: isMobile ? '0.85rem' : '1rem',
            },
            '& td': {
                fontSize: isMobile ? '0.8rem' : '0.95rem',
                textAlign: 'center',
            },
            }}
            size={isMobile ? 'small' : 'medium'}
        >
            <TableHead>
            <TableRow>
                <TableCell>Actividad</TableCell>
                <TableCell>Puntaje</TableCell>
                <TableCell>Duración (s)</TableCell>
                <TableCell>Fecha</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {results.length === 0 ? (
                <TableRow>
                <TableCell colSpan={4} align="center">
                    <Typography
                    variant="body2"
                    color="textSecondary"
                    >
                    No hay resultados para mostrar
                    </Typography>
                </TableCell>
                </TableRow>
            ) : (
                results.map((res) => (
                <TableRow
                    key={`${res.activity.id}-${res.completedAt}`}
                    hover
                    sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    }}
                >
                    <TableCell>#{res.activity.id}</TableCell>
                    <TableCell>{res.result ?? '-'}</TableCell>
                    <TableCell>{res.durationSeconds ?? '-'}</TableCell>
                    <TableCell>{res.completedAt?.split('T')[0] ?? '-'}</TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
        </Table>
        </Box>
    );
    };

    export default ActivityResultTable;
