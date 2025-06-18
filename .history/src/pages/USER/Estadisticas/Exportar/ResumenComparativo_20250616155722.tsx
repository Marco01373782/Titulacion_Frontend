    // src/pages/USER/Estadisticas/Resumen/ResumenComparativo.tsx
    import React, { useEffect, useState } from 'react';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';
    import './ResumenComparativo.css';
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

    useEffect(() => {
        if (userId) {
        getPacientePorUsuario(userId)
            .then(res => setPaciente(res.data))
            .catch(err => console.error('Error al obtener paciente', err));
        }
    }, [userId]);

    if (sesiones.length === 0) {
        return <p>No hay sesiones para comparar.</p>;
    }

    const promedioTotal = Math.round(
        sesiones.reduce((acc, s) => acc + (s.result ?? 0), 0) / sesiones.length
    );

    const promedioTiempo = Math.round(
        sesiones.reduce((acc, s) => acc + (s.sessionDurationSeconds ?? 0), 0) / sesiones.length
    );

                const exportPDF = () => {
                const doc = new jsPDF();
                doc.setFont('helvetica'); // Fuente segura para caracteres latinos
                doc.setFontSize(20);
                doc.setTextColor('#1976d2');
                doc.text("Informe Comparativo de Sesiones", 14, 20);

                if (paciente) {
                    // Caja con fondo azul claro
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

                // Formatear fecha para mostrar mejor
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
        <div className="resumen-comparativo-container">
        <h2>📤 Resumen Comparativo</h2>
        {paciente && (
            <div className="paciente-info">
            <p><strong>Paciente:</strong> {paciente.firstname} {paciente.secondname} {paciente.surname}</p>
            <p><strong>Edad:</strong> {paciente.age} años</p>
            <p><strong>Género:</strong> {paciente.gender}</p>
            </div>
        )}

        <p><strong>Promedio de resultados:</strong> {promedioTotal} puntos</p>
        <p><strong>Duración promedio por sesión:</strong> {promedioTiempo} segundos</p>

        <table className="tabla-comparativa">
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Resultado</th>
                <th>Duración (s)</th>
                <th>Modo</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            {sesiones.map((s) => (
                <tr key={s.id}>
                <td>{s.date}</td>
                <td>{Math.round(s.result ?? 0)}</td>
                <td>{s.sessionDurationSeconds ?? 'N/A'}</td>
                <td>{s.mode ?? 'N/A'}</td>
                <td>{s.status}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <button className="btn-export" onClick={exportPDF}>📄 Exportar a PDF</button>
        </div>
    );
    };

    export default ResumenComparativo;
