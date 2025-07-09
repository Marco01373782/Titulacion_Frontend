
            import FiguraFaltante from "../../../actividades/ESTANDAR/FiguraFaltante";
            import ColoresSecuencia from "../../../actividades/ESTANDAR/SecuenciaDeColores";
            import RecordarPalabras from "../../../actividades/ESTANDAR/RecordarPalabras";
            import RecordarPalabras from "../../../actividades/ESTANDAR/RecordarPalabras";
            
            
            import MemoriaIntermedio from "../../../actividades/TEST/memoria/MemoriaIntermedio";
            
            import MemoriaAvanzada from "../../../actividades/AVANZADO/memoria/MemoriaAvanzado";
            

            import RazonamientoIntermedio from "../../../actividades/TEST/razonamiento/RazonamientoIntermedio";
            import RazonamientoPrincipiante from "../../../actividades/PRINCIPIANTE/razonamiento/RazonamientoPrincipiante";
            import RazonamientoAvanzado from "../../../actividades/AVANZADO/razonamiento/RazonamientoAvanzado";

            import AtencionIntermedio from "../../../actividades/TEST/atencion y concentracion/AtencionIntermedio";
            import AtencionPrincipiante from "../../../actividades/PRINCIPIANTE/atencion y concentracion/AtencionPrincipiante";
            import AtencionAvanzado from "../../../actividades/AVANZADO/atencion y concentracion/AtencionAvanzado";


            const activityComponentsMap: Record<string, any> = {
                '/actividades/figura-faltante': FiguraFaltante,
                '/actividades/secuencia-colores': ColoresSecuencia,
                '/actividades/recordar-palabras':RecordarPalabras,

        /*memoria*/ 
            '/actividades/memoria-intermedio': MemoriaIntermedio,
            
            '/actividades/memoria-avanzada': MemoriaAvanzada,

        /*razonamiento*/ 
            '/actividades/razonamiento-intermedio': RazonamientoIntermedio,
            '/actividades/razonamiento-principiante': RazonamientoPrincipiante,
            '/actividades/razonamiento-avanzado': RazonamientoAvanzado,
        
        /* Atencion y Concentracion*/
            '/actividades/atencion-intermedio': AtencionIntermedio,
            '/actividades/atencion-principiante': AtencionPrincipiante,
            '/actividades/atencion-avanzado': AtencionAvanzado,

            
            };

            export default activityComponentsMap;