import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import constants from '../../../server/utils/constants';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(constants.false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError(null);
      setLoading(constants.true);
      const result = await axios.post('/api/auth/signup', formData, {
        'Content-Type': 'application/json',
      });

      if (result.status == constants.false) {
        setLoading(constants.false);
        setError(result.message);
        return;
      }
      setLoading(constants.false);
      setFormData({});
      navigate('/sign-in');
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(constants.false);
    }
  };

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>

      {error && <p className='mb-3 text-center text-red-700'>{error}</p>}

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          className='p-3 border rounded-lg outline-none'
          autoComplete='username'
          onChange={handleChange}
          required
        />

        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email'
          className='p-3 border rounded-lg outline-none'
          autoComplete='email'
          onChange={handleChange}
          required
        />

        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          className='p-3 border rounded-lg outline-none'
          autoComplete='current-password'
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in' className='text-blue-700 hover:text-blue-800'>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
