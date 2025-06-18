    import { useMode } from '../../../components/context/ModeContext';
    import SesionesConTest from './Individual/SesionesConTest';  // 🚀 Nuevo componente padre
    import GroupSesionGrid from './Grupal/GroupSesionGrid';

    const SesionRouter = () => {
    const { mode } = useMode();

    return mode === 'INDIVIDUAL' ? <SesionesConTest /> : <GroupSesionGrid />;   
    };

    export default SesionRouter;
