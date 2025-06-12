    // src/pages/User/SesionRouter.tsx
    import { useMode } from '../../../components/context/ModeContext';
    import SessionGrid from './Individual/SesionGrid';
    import GroupSessionRunner from './Grupal/GroupSesionGrid';

    const SesionRouter = () => {
    const { mode } = useMode();
        console.log('📦 SesionRouter montado');
        console.log('🧪 Modo actual:', mode);


    return mode === 'INDIVIDUAL' ? <SessionGrid /> : <Gr />;
    
    };

    export default SesionRouter;
