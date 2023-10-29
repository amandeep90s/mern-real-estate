import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4'>
        <img
          src={currentUser.data.avatar}
          alt={currentUser.data.username}
          className='object-cover w-24 h-24 rounded=full cursor-pointer self-center mt-2'
        />

        <input
          type='text'
          id='username'
          name='username'
          placeholder='Username'
          autoComplete='username'
          className='p-3 border rounded-lg'
        />

        <input
          type='email'
          id='email'
          name='email'
          placeholder='Email'
          autoComplete='email'
          className='p-3 border rounded-lg'
        />

        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          autoComplete='new-password'
          className='p-3 border rounded-lg'
        />

        <button
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'
        >
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
