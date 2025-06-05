    import MemoriaTest from "../../actividades/TEST/memoria/MemoriaTest";
    import MemoriaPrincipiante from "../../actividades/PRINCIPIANTE/memoria/MemoriaPrincipiante";
    import MemoriaAvanzada from "../../actividades/AVANZADO/memoria/MemoriaAvanzado";
    


    const activityComponentsMap: Record<string, any> = {
    '/actividades/memoria-test': MemoriaTest,
    '/actividades/memoria-principiante': MemoriaPrincipiante,
     '/actividades/memoria-principiante': MemoriaPrincipiante,

    };

    export default activityComponentsMap;