import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../firebase.js';

const FALSE = false;
const TRUE = true;

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(FALSE);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState(FALSE);
  const [loading, setLoading] = useState(FALSE);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: FALSE,
    parking: FALSE,
    furnished: FALSE,
  });
  const params = useParams();

  const getListing = useCallback(async () => {
    const { id } = params;
    try {
      const listing = await axios.get(`/api/listing/${id}`);

      if (listing.data.status) {
        setFormData(listing.data.listing);
      } else {
        setError(listing.data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  }, [params]);

  useEffect(() => {
    getListing();
  }, [getListing]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(TRUE);
      setImageUploadError(null);
      const promises = [];

      for (const file of files) {
        promises.push(storeImage(file));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(null);
          setUploading(FALSE);
        })
        .catch((error) => {
          console.error(error);
          setUploading(FALSE);
          setImageUploadError('Image upload failed (2MB max per image)');
        });
    } else {
      setUploading(FALSE);
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = `${new Date().getTime()}${file.name}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changes',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} completed`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (event) => {
    if (event.target.id === 'rent' || event.target.id === 'sale') {
      setFormData({ ...formData, type: event.target.id });
    }
    if (
      event.target.id === 'parking' ||
      event.target.id === 'furnished' ||
      event.target.id === 'offer'
    ) {
      setFormData({ ...formData, [event.target.id]: event.target.checked });
    }
    if (
      event.target.type === 'number' ||
      event.target.type === 'text' ||
      event.target.type === 'textarea'
    ) {
      setFormData({ ...formData, [event.target.id]: event.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formData.imageUrls.length === 0) {
        return setError('You must upload minimum one image');
      }
      if (Number(formData.regularPrice) < Number(formData.discountPrice)) {
        return setError('Discount price must be lower than regular price');
      }
      setLoading(TRUE);
      const response = await axios.put(
        `/api/listing/${formData._id}`,
        { ...formData, userRef: currentUser.data.id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(FALSE);
      if (!response.data.status) {
        setError(response.message);
      } else {
        navigate(`/listing/${response.data.listing._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(FALSE);
    }
  };

  return (
    formData?._id && (
      <main className='max-w-4xl p-3 mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Update a Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 sm:flex-row'
          id='create-listing'
        >
          <div className='flex flex-col flex-1 gap-4'>
            <input
              type='text'
              placeholder='Name'
              className='p-3 border border-gray-300 rounded-lg outline-none'
              id='name'
              maxLength='62'
              minLength='10'
              onChange={handleChange}
              value={formData.name}
              autoComplete='name'
              required
            />
            <textarea
              placeholder='Description'
              className='p-3 border border-gray-300 rounded-lg outline-none'
              id='description'
              onChange={handleChange}
              value={formData.description}
              autoComplete='description'
              required
            />
            <input
              type='text'
              placeholder='Address'
              className='p-3 border border-gray-300 rounded-lg outline-none'
              id='address'
              onChange={handleChange}
              value={formData.address}
              autoComplete='address'
              required
            />

            <div className='flex flex-wrap gap-6'>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  name='sale'
                  id='sale'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span>Sell</span>
              </div>

              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  name='rent'
                  id='rent'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span>Rent</span>
              </div>

              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  name='parking'
                  id='parking'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>

              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  name='furnished'
                  id='furnished'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>

              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  name='offer'
                  id='offer'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  name='bedrooms'
                  id='bedrooms'
                  className='p-3 border border-gray-300 rounded-lg outline-none'
                  min={1}
                  max={10}
                  onChange={handleChange}
                  value={formData.bedrooms}
                  autoComplete='bedrooms'
                />
                <span>Beds</span>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  name='bathrooms'
                  id='bathrooms'
                  className='p-3 border border-gray-300 rounded-lg outline-none'
                  min={1}
                  max={10}
                  onChange={handleChange}
                  value={formData.bathrooms}
                  autoComplete='bathrooms'
                />
                <span>Baths</span>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  name='regularPrice'
                  id='regularPrice'
                  className='p-3 border border-gray-300 rounded-lg outline-none'
                  min={50}
                  max={1000000}
                  onChange={handleChange}
                  value={formData.regularPrice}
                  autoComplete='regularPrice'
                  required
                />
                <div className='flex flex-col items-center'>
                  <p>Regular Price</p>
                  <span className='text-xs'>($ / Month)</span>
                </div>
              </div>

              {formData.offer && (
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    name='discountPrice'
                    id='discountPrice'
                    className='p-3 border border-gray-300 rounded-lg outline-none'
                    min={0}
                    max={10000000}
                    onChange={handleChange}
                    value={formData.discountPrice}
                    autoComplete='discountPrice'
                  />
                  <div className='flex flex-col items-center'>
                    <p>Discounted Price</p>
                    <span className='text-xs'>($ / Month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-normal text-gray-600'>
              <span className='mr-2 font-semibold text-gray-900'>Images:</span>{' '}
              The first image will be the cover (max 6)
            </p>

            <div className='flex gap-4'>
              <input
                type='file'
                name='images'
                id='images'
                className='w-full p-3 border border-gray-300 rounded outline-none'
                onChange={(e) => setFiles(e.target.files)}
                accept='image/*'
                multiple
              />

              <button
                type='button'
                className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-500'
                onClick={handleImageSubmit}
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {imageUploadError && (
              <p className='text-xs text-red-700'>{imageUploadError}</p>
            )}

            {formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex items-center justify-between p-3 border'
              >
                <img
                  src={url}
                  alt='Listing Image'
                  className='object-contain w-20 h-20 rounded-lg'
                />
                <button
                  type='button'
                  className='p-3 text-red-700 uppercase hover:opacity-75'
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type='submit'
              className='p-3 text-white rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed'
              disabled={loading || uploading}
            >
              {loading ? 'Saving...' : 'Update Listing'}
            </button>
            {error && (
              <p className='text-xs text-center text-red-700'>{error}</p>
            )}
          </div>
        </form>
      </main>
    )
  );
};

export default UpdateListing;
