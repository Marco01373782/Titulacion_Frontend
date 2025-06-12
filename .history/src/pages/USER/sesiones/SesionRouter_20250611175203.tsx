    // src/pages/User/SesionRouter.tsx
    import { useMode } from '../../../components/context/ModeContext';
    import SessionGrid from './Individual/SesionGrid';
    import GroupSessionRunner from './Grupal/GroupSessionRunner';

    const SesionRouter = () => {
    const { mode } = useMode();
        console.log('📦 SesionRouter montado');
        console.log('🧪 Modo actual:', mode);


    return mode === 'INDIVIDUAL' ? <SessionGrid /> : <GroupSessionRunner />;
    
    };

    export default SesionRouter;
