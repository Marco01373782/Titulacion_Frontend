    // src/pages/USER/Estadisticas/Resumen/ResumenComparativo.tsx
    import React from 'react';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';
    import './ResumenComparativo.css';

    interface Sesion {
    id: number;
    date: string;
    result: number;
    sessionDurationSeconds: number;
    mode?: string; // Puedes agregar más campos si tienes, ejemplo modo de sesión
    activitiesCompleted?: number; // Ejemplo: cantidad actividades completadas
    }

    interface Props {
    sesiones: Sesion[];
    }

    const ResumenComparativo: React.FC<Props> = ({ sesiones }) => {
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

        doc.setFontSize(18);
        doc.text("Resumen Comparativo de Sesiones", 14, 22);

        doc.setFontSize(12);
        doc.text(`Promedio general de resultados: ${promedioTotal} puntos`, 14, 32);
        doc.text(`Duración promedio por sesión: ${promedioTiempo} segundos`, 14, 40);

        const tableColumn = ["Fecha", "Resultado", "Duración (s)", "Modo", "Actividades Completadas"];
        const tableRows: (string | number)[][] = [];

            sesiones.forEach(s => {
            const row: (string | number)[] = [
                s.date,
                s.result ?? "-",
                s.sessionDurationSeconds ?? "-",
                s.mode ?? "-",
                s.activitiesCompleted ?? "-"
            ];
            tableRows.push(row);
            });

        autoTable(doc, {
        startY: 50,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }, // azul
        alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        doc.save("ResumenComparativo.pdf");
    };

    return (
        <div className="resumen-comparativo-container">
        <h2>📤 Resumen Comparativo</h2>
        <p><strong>Promedio general de resultados:</strong> {promedioTotal} puntos</p>
        <p><strong>Duración promedio por sesión:</strong> {promedioTiempo} segundos</p>

        <table className="tabla-comparativa">
            <thead>
            <tr>
                <th>Fecha</th>
                <th>Resultado</th>
                <th>Duración (s)</th>
                <th>Modo</th>
                <th>Actividades Completadas</th>
            </tr>
            </thead>
            <tbody>
            {sesiones.map((s) => (
                <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.result}</td>
                <td>{s.sessionDurationSeconds}</td>
                <td>{s.mode ?? "-"}</td>
                <td>{s.activities ?? "-"}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <button className="btn-export" onClick={exportPDF}>📄 Exportar a PDF</button>
        </div>
    );
    };

    export default ResumenComparativo;
