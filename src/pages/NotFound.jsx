import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '3em', color: '#ff6f61' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.5em' }}>Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={goHome}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1em',
          color: '#fff',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
