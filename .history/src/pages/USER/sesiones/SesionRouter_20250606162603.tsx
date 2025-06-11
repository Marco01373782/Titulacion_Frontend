// src/pages/User/SesionRouter.tsx
import { U
import SessionGrid from './SesionGrid';
import GroupSessionRunner from './GroupSessionRunner';

const SesionRouter = () => {
  const { mode } = useMode();

  return mode === 'INDIVIDUAL' ? <SessionGrid /> : <GroupSessionRunner />;
};

export default SesionRouter;
