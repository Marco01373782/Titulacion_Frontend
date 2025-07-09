
            import NumeroFaltante from "../../../actividades/ESTANDAR/NumeroFaltante";
            
            
            
            
            import MemoriaIntermedio from "../../../actividades/TEST/memoria/MemoriaIntermedio";
            import MemoriaPrincipiante from "../../../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante";
            import MemoriaAvanzada from "../../../actividades/AVANZADO/memoria/MemoriaAvanzado";
            

            import RazonamientoIntermedio from "../../../actividades/TEST/razonamiento/RazonamientoIntermedio";
            import RazonamientoPrincipiante from "../../../actividades/PRINCIPIANTE/razonamiento/RazonamientoPrincipiante";
            import RazonamientoAvanzado from "../../../actividades/AVANZADO/razonamiento/RazonamientoAvanzado";

            import AtencionIntermedio from "../../../actividades/TEST/atencion y concentracion/AtencionIntermedio";
            import AtencionPrincipiante from "../../../actividades/PRINCIPIANTE/atencion y concentracion/AtencionPrincipiante";
            import AtencionAvanzado from "../../../actividades/AVANZADO/atencion y concentracion/AtencionAvanzado";


            const activityComponentsMap: Record<string, any> = {
                ''

        /*memoria*/ 
            '/actividades/memoria-intermedio': MemoriaIntermedio,
            '/actividades/memoria-principiante': MemoriaPrincipiante,
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