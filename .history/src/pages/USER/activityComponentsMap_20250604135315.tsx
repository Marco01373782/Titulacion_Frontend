
        import MemoriaTest from "../../actividades/TEST/memoria/MemoriaTest";
        import MemoriaPrincipiante from "../../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante";
        import MemoriaAvanzada from "../../actividades/AVANZADO/memoria/MemoriaAvanzado";
        

        import RazonamientoTest from "../../actividades/TEST/razonamiento/RazonamientoTest";
        import RazonamientoPrincipiante from "../../actividades/PRINCIPIANTE/razonamiento/RazonamientoPrincipiante";
        import RazonamientoAvanzado from "../../actividades/AVANZADO/razonamiento/RazonamientoAvanzado";


        const activityComponentsMap: Record<string, any> = {
    /*memoria*/ 
        '/actividades/memoria-test': MemoriaTest,
        '/actividades/memoria-principiante': MemoriaPrincipiante,
        '/actividades/memoria-avanzada': MemoriaAvanzada,
    /*razonamiento*/ 
        '/actividades/razonamiento-test': RazonamientoTest,
        '/actividades/razonamiento-principiante': RazonamientoPrincipiante,
        '/actividades/razonamiento-avanzado': RazonamientoAvanzado,
    
            
        
        };

        export default activityComponentsMap;