import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { app } from '../firebase.js';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice.js';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [showListingsError, setShowListingsError] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);

  const handleFileUpload = useCallback(
    (file) => {
      setFileUploadError(false);
      if (file) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePercentage(Math.round(progress));
          },
          (error) => {
            console.error(error);
            setFileUploadError(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
              setFormData({ ...formData, avatar: downloadURL })
            );
          }
        );
      }
      setFile(undefined);
    },
    [formData]
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      dispatch(updateUserStart());

      const result = await axios.post(
        `/api/user/update/${currentUser.data.id}`,
        formData,
        {
          'Content-Type': 'application/json',
        }
      );

      if (!result.status) {
        dispatch(updateUserFailure(result.message));
        return;
      }

      dispatch(updateUserSuccess(result));
      setUpdateSuccessMessage(result.data.message);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async (event) => {
    event.preventDefault();

    try {
      dispatch(deleteUserStart());

      const result = await axios.delete(
        `/api/user/delete/${currentUser.data.id}`
      );

      if (!result.status) {
        dispatch(deleteUserFailure(result.message));
        return;
      }

      dispatch(deleteUserSuccess(result));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async (event) => {
    event.preventDefault();

    try {
      dispatch(signOutUserStart());
      const result = await axios.get('/api/auth/signout');

      if (!result.status) {
        dispatch(signOutUserFailure(result.message));
        return;
      }

      dispatch(signOutUserSuccess(result));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const response = await axios.get(
        `/api/user/listings/${currentUser.data.id}`
      );

      if (!response.data.status) {
        return setShowListingsError(true);
      }

      setListings(response.data.listings);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  /**
   *  Firebase store rules
   *  allow read;
   *  allow write: if
   *  request.resource.size < 2 * 1024 * 1024 &&
   *  request.resource.contentType.matches('image/.*')
   */
  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          name='avatar'
          id='avatar'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={formData?.avatar || currentUser.data.avatar}
          alt={currentUser.data.username}
          className='object-cover w-24 h-24 rounded=full cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              fileRef.current.click();
            }
          }}
        />

        <p className='self-center text-sm'>
          {fileUploadError && (
            <span className='text-red-700'>
              Error image upload (image must be less than 2mb)
            </span>
          )}
          {filePercentage > 0 && filePercentage < 100 && (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          )}
          {filePercentage === 100 && !fileUploadError && (
            <span className='text-green-700'>Image successfully uploaded</span>
          )}
        </p>

        <input
          type='text'
          id='username'
          name='username'
          placeholder='Username'
          autoComplete='username'
          className='p-3 border rounded-lg'
          defaultValue={currentUser.data.username}
          onChange={handleChange}
        />

        <input
          type='email'
          id='email'
          name='email'
          placeholder='Email'
          autoComplete='email'
          className='p-3 border rounded-lg'
          defaultValue={currentUser.data.email}
          onChange={handleChange}
        />

        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          autoComplete='new-password'
          className='p-3 border rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type='submit'
          className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link
          to='/create-listing'
          className='p-3 text-center text-white uppercase bg-green-700 rounded-lg hover:opacity-95'
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleDeleteUser}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              handleDeleteUser();
            }
          }}
        >
          Delete account
        </span>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleSignOut}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Space') {
              handleSignOut();
            }
          }}
        >
          Sign out
        </span>
      </div>

      {error && <p className='mt-5 text-center text-red-700'>{error}</p>}

      {updateSuccessMessage && (
        <p className='mt-5 text-center text-green-700'>
          {updateSuccessMessage}
        </p>
      )}

      <button
        className='w-full mt-5 text-green-700'
        onClick={handleShowListings}
      >
        Show Listings
      </button>

      {showListingsError && (
        <p className='mt-5 text-red-700'>Error Showing Listings</p>
      )}

      {listings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-center mt-7'>
            Your Listings
          </h1>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className='flex items-center justify-between gap-4 p-3 border rounded-lg'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='Listing cover'
                  className='object-contain w-16 h-16 rounded-lg'
                />
              </Link>

              <Link
                to={`/listing/${listing._id}`}
                className='flex-1 font-semibold truncate text-slate-700 hover:underline'
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col'>
                <button type='button' className='text-red-700'>
                  Delete
                </button>
                <button type='button' className='text-green-700'>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
