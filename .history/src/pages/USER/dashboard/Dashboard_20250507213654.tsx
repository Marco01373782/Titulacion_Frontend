
import './Dashboard.css';
import Camila from '../../../assets/camila.jpeg';
const Dashboard = () => {
  return (
    <div className='div-principal'>
      <h2>Bienvenido al Dashboard</h2>
      <p>PAGINA PRINCIPAL DE CONTENIDO </p>
      <img src={camila} alt="" />
    </div>
  );
};

export default Dashboard;
