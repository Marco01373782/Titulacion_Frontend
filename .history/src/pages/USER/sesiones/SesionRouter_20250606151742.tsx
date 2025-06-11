// src/pages/User/SesionRouter.tsx
import { useMode } from '../../../context/ModeContext';
import SessionGrid from './SesionGrid';
import GroupSessionRun

const SesionRouter = () => {
  const { mode } = useMode();

  return mode === 'INDIVIDUAL' ? <SessionGrid /> : <GroupSessionRunner />;
};

export default SesionRouter;
