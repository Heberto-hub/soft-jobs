import axios from 'axios'
import Context from '../contexts/Context'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constans' // Asegúrate de que ENDPOINT.users sea 'http://localhost:3000/usuarios'

const Profile = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)

  const getDeveloperData = () => {
    const token = window.sessionStorage.getItem('token')

    if (!token) {
      // Si no hay token, redirigir al login o a la página principal
      console.warn('No se encontró un token. Redirigiendo al inicio de sesión.');
      setDeveloper(null);
      navigate('/login'); // O '/' si prefieres
      return;
    }

    axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data: user }) => { // CAMBIO CLAVE AQUÍ: Esperar directamente el objeto 'user'
        console.log('Datos del usuario recibidos:', user); // Para depuración
        setDeveloper({ ...user }); // Establecer el estado con los datos del usuario
      })
      .catch((error) => {
        console.error('Error al obtener datos del desarrollador:', error.response ? error.response.data : error.message);
        window.sessionStorage.removeItem('token'); // Limpiar token inválido/expirado
        setDeveloper(null);
        navigate('/login'); // Redirigir al login en caso de error
      })
  }

  useEffect(() => {
    getDeveloperData();
  }, []) // El array vacío asegura que se ejecute solo una vez al montar el componente

  return (
    <div className='py-5'>
      <h1>
        Bienvenido <span className='fw-bold'>{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.lenguage}
      </h3>
    </div>
  )
}

export default Profile
