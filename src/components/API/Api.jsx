import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29414581-04780822c1d2ceb9af08e1854';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';
const per_page = 12;

export const getGalleryData = async (query, page) => {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&${PARAMS}&page=${page}&per_page=${per_page}`;

  const response = await axios.get(url);
  const images = response.data.hits;
  let result = null;

  if (images.length === 0) {
    return Promise.reject(
      'Nothing was found according to your request. Please try again.'
    );
  } else {
    result = {
      images: images,
      total: Math.ceil(response.data.totalHits / per_page),
    };
    return result;
  }
};
