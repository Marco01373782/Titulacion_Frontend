// src/pages/User/SesionRouter.tsx
import { useMod
import SessionGrid from './SessionGrid';
import GroupSessionRunner from './GroupSessionRunner';

const SesionRouter = () => {
  const { mode } = useMode();

  return mode === 'INDIVIDUAL' ? <SessionGrid /> : <GroupSessionRunner />;
};

export default SesionRouter;
