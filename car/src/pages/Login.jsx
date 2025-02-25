import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome to Car Marketplace
        </h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.36 14.3c-.28-.8-.75-1.5-1.35-2.1-.6-.6-1.3-1.07-2.1-1.35-.33-.1-.68-.18-1.03-.23v1.8l-4.24-4.24L12.88 6v1.8c1.15.13 2.24.5 3.23 1.09 1.2.72 2.15 1.67 2.87 2.87.59.99.96 2.08 1.09 3.23.01.06.01.11.01.17 0 .41-.33.74-.74.74-.38 0-.69-.28-.73-.64z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;