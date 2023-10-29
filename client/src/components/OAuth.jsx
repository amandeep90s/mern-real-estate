import axios from 'axios';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInFailure, signInSuccess } from '../redux/user/userSlice.js';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const {
        user: { displayName: name, email, photoURL: photo },
      } = await signInWithPopup(auth, provider);

      const requestData = {
        name,
        email,
        photo,
      };

      const response = await axios.post('/api/auth/google', requestData, {
        'Content-Type': 'application/json',
      });

      dispatch(signInSuccess(response));
      navigate('/profile');
    } catch (error) {
      console.log('Could not sign in with google', error);
      dispatch(signInFailure(error?.response?.data?.message || error?.message));
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='p-3 text-white uppercase bg-red-700 rounded-lg hover:opacity-95'
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
