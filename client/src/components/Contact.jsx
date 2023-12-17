import axios from 'axios';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const fetchLandLoard = useCallback(async () => {
    try {
      const result = await axios.get(`/api/user/${listing.userRef}`);
      if (result.data.status) {
        setLandlord(result.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  }, [listing.userRef]);

  useEffect(() => {
    fetchLandLoard();
  }, [fetchLandLoard]);

  return (
    landlord && (
      <div className='flex flex-col gap-2'>
        <p>
          Contact <span className='font-semibold'>{landlord.username}</span> for{' '}
          <span className='font-semibold'>{listing.name.toLowerCase()}</span>
        </p>

        <textarea
          name='message'
          id='message'
          rows='2'
          value={message}
          onChange={onChange}
          placeholder='Enter your mesage here...'
          className='w-full p-3 border rounded-lg'
        />

        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='p-3 text-center text-white uppercase rounded-lg bg-slate-700 hover:opacity-95'
        >
          Send Message
        </Link>
      </div>
    )
  );
};

// Define prop types
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Contact;
