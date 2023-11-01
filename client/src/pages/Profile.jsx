import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { app } from '../firebase.js';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

      <form className='flex flex-col gap-4'>
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
          src={formData.avatar || currentUser.data.avatar}
          alt={currentUser.data.username}
          className='object-cover w-24 h-24 rounded=full cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
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
