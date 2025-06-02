import React, { useEffect, useState } from 'react';
import { getUserSessions } from '@/services/ApiService';
import { useNavigate } from 'react-router-dom';
import './SesionGrid.css';

const SesionGrid = ({ userId }: { userId: number }) => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserSessions(userId).then(setSessions);
  }, [userId]);

  const handleClick = (sessionId: number) => {
    navigate(`/app/ejecutar-sesion/${sessionId}`);
  };

  return (
    <div className="sesion-grid">
      {sessions.map((s, i) => (
        <div
          key={s.id}
          className={`circle ${s.completed ? 'completed' : 'pending'}`}
          onClick={() => handleClick(s.id)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default SesionGrid;
