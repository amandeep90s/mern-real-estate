import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import constants from '../../../server/utils/constants';

const SignIn = () => {
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
      const result = await axios.post('/api/auth/signin', formData, {
        'Content-Type': 'application/json',
      });

      if (result.status == constants.false) {
        setLoading(constants.false);
        setError(result.message);
        return;
      }
      setLoading(constants.false);
      setFormData({});
      navigate('/');
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(constants.false);
    }
  };

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>

      {error && <p className='mb-3 text-center text-red-700'>{error}</p>}

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
          {loading ? 'Loading' : 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Create an account?</p>
        <Link to='/sign-up' className='text-blue-700 hover:text-blue-800'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
