import React, { useState } from 'react';
import iconGrupal from '../../../assets/grupo.svg';
import iconIndividual from '../../../assets/user.svg';

const ModeSelector = () => {
  const { mode, setMode } = useMode();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedMode: ModeType) => {
    setMode(selectedMode);
    setIsOpen(false);
  };

  return (
    <div className="modo-card-wrapper">
      <div className="modo-card" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={mode === 'GRUPAL' ? iconGrupal : iconIndividual}
          alt="Modo icono"
          className="modo-icono"
        />
        <span className="modo-texto">{mode}</span>
        <span className="modo-flecha">▼</span>
      </div>

      {isOpen && (
        <div className="modo-dropdown">
          <div className="modo-opcion" onClick={() => handleSelect('INDIVIDUAL')}>
            <img src={iconIndividual} alt="Individual" />
            Individual
          </div>
          <div className="modo-opcion" onClick={() => handleSelect('GRUPAL')}>
            <img src={iconGrupal} alt="Grupal" />
            Grupal
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
