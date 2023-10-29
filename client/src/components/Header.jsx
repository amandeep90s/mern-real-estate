import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='shadow-md bg-slate-200'>
      <div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
        <Link to='/'>
          <h1 className='flex flex-wrap text-sm font-bold sm:text-xl'>
            <span className='text-slate-500'>Real</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        <form className='flex items-center justify-between p-3 rounded-lg bg-slate-100'>
          <input
            type='search'
            name='search'
            id='search'
            placeholder='Search...'
            className='w-24 bg-transparent focus:outline-none sm:w-64'
          />
          <FaSearch className='text-slate-600' />
        </form>

        <ul className='flex gap-4'>
          <li>
            <Link
              to='/'
              className='hidden sm:inline text-slate-700 hover:underline'
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to='/about'
              className='hidden sm:inline text-slate-700 hover:underline'
            >
              About
            </Link>
          </li>
          <li>
            {currentUser ? (
              <Link to='/profile'>
                <img
                  src={currentUser.data.avatar}
                  alt={currentUser.data.username}
                  className='object-cover w-7 h-7 rounded-fulll'
                />
              </Link>
            ) : (
              <Link to='/sign-in' className='text-slate-700 hover:underline'>
                Sign in
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
