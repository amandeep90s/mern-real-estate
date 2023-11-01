import { useState } from 'react';

const CreateListing = () => {
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
    offer: false,
    parking: false,
    furnished: false,
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <main className='max-w-4xl p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
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
            type='text'
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
              <input type='checkbox' name='sale' id='sale' className='w-5' />
              <span>Sell</span>
            </div>

            <div className='flex gap-2'>
              <input type='checkbox' name='rent' id='rent' className='w-5' />
              <span>Rent</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='parking'
                id='parking'
                className='w-5'
              />
              <span>Parking Spot</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='furnished'
                id='furnished'
                className='w-5'
              />
              <span>Furnished</span>
            </div>

            <div className='flex gap-2'>
              <input type='checkbox' name='offer' id='offer' className='w-5' />
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
                autoComplete='bedrooms'
                required
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
                autoComplete='bathrooms'
                required
              />
              <span>Baths</span>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                name='regularPrice'
                id='regularPrice'
                className='p-3 border border-gray-300 rounded-lg outline-none'
                min={1}
                max={10}
                onChange={handleChange}
                autoComplete='regularPrice'
                required
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                name='discountPrice'
                id='discountPrice'
                className='p-3 border border-gray-300 rounded-lg outline-none'
                min={1}
                max={10}
                onChange={handleChange}
                autoComplete='discountPrice'
                required
              />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
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
              accept='image/*'
              multiple
            />

            <button
              type='button'
              className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80'
            >
              Upload
            </button>
          </div>
          <button
            type='submit'
            className='p-3 text-white rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
