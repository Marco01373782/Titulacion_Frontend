
            import FiguraFaltante from "../../../actividades/ESTANDAR/FiguraFaltante";
            import ColoresSecuencia from "../../../actividades/ESTANDAR/SecuenciaDeColores";
            import RecordarPalabras from "../../../actividades/ESTANDAR/RecordarPalabras";
            import RecordarImagenes from "../../../actividades/ESTANDAR/RecordarImagenes";
            import RecordarImagenes1 from "../../../actividades/ESTANDAR/RecordarImagenes1";
            
            
           


            const activityComponentsMap: Record<string, any> = {
                '/actividades/figura-faltante': FiguraFaltante,
                '/actividades/secuencia-colores': ColoresSecuencia,
                '/actividades/recordar-palabras':RecordarPalabras,
                '/actividades/recordar-imagenes':RecordarImagenes,
                '/actividades/recordar-imagenes1':RecordarImagenes1,

    

            
            };

            export default activityComponentsMap;