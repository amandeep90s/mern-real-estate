import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>

      <form className='flex flex-col gap-4'>
        <input
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          className='p-3 border rounded-lg outline-none'
          autoComplete='username'
        />
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email'
          className='p-3 border rounded-lg outline-none'
          autoComplete='email'
        />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          className='p-3 border rounded-lg outline-none'
          autoComplete='current-password'
        />

        <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>
          Sign Up
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
