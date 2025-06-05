    /*memoria*/ 
    import MemoriaTest from "../../actividades/TEST/memoria/MemoriaTest";
    import MemoriaPrincipiante from "../../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante";
    import MemoriaAvanzada from "../../actividades/AVANZADO/memoria/MemoriaAvanzado";
    
    /*razonamiento*/ 
    import RazonamientoTest from "../../actividades/TEST/razonamiento/RazonamientoTest";


    const activityComponentsMap: Record<string, any> = {
 /*memoria*/ 
    '/actividades/memoria-test': MemoriaTest,
    '/actividades/memoria-principiante': MemoriaPrincipiante,
    '/actividades/memoria-avanzada': MemoriaAvanzada,
 /*razonamiento*/ 
    '/actividades/razonamiento-test': MemoriaAvanzada,
    };

    export default activityComponentsMap;