import { useState, useCallback, useRef, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { getGalleryData } from './API/Api';

import { Gallery } from './ImageGallery/ImageGallery.styled';
import { GalleryNotification } from './ImageGallery/ImageGallery.styled';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [state, setState] = useState({
    query: '',
    page: 0,
    images: [],
    loading: false,
    error: null,
    lastPage: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [image, setImage] = useState({});

  const onSubmitRef = useRef(null);

  const toggleModal = useCallback(
    (image = {}) => {
      setImage(image);

      setIsModalOpen(prevState => !prevState);
    },
    [setIsModalOpen, setImage]
  );

  const getImages = useCallback(
    searchTerm => {
      const query = searchTerm === undefined ? state.query : searchTerm;
      const page = searchTerm === undefined ? state.page + 1 : 1;

      setState({ query, loading: true, error: null, images: [], page });

      getGalleryData(query, page)
        .then(result => {
          setState({
            query,
            images:
              page === 1 ? result.images : [...state.images, ...result.images],
            error: null,
            loading: false,
            page,
            lastPage: page === result.total,
          });
        })
        .catch(error => {
          setState({ query, error, loading: false, images: [], page });
        });
    },
    [state, setState]
  );

  const searchImage = useCallback(
    query => {
      getImages(query);
    },
    [getImages]
  );

  onSubmitRef.current = searchImage;

  const loadMore = useCallback(() => {
    getImages();
  }, [getImages]);

  const onSubmit = useCallback(
    query => {
      onSubmitRef.current(query);
    },
    [onSubmitRef]
  );

  const scrollPage = () => {
    const { height: cardHeight } = document
      .querySelector('#gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollPage();
  }, [state]);

  return (
    <>
      <Searchbar onSubmit={onSubmit} />
      <Gallery id="gallery">
        {state.loading && <Loader />}
        {state.error && (
          <GalleryNotification>Sorry...{state.error}</GalleryNotification>
        )}
        <ImageGallery images={state.images} />
        {!state.lastPage && !state.error && !state.loading && (
          <Button
            disabled={state.loading || state.error}
            clickHandle={loadMore}
          >
            load more
          </Button>
        )}
        {isModalOpen && (
          <Modal
            src={image.largeImageURL}
            alt={image.tags}
            onClose={toggleModal}
          />
        )}
      </Gallery>
    </>
  );
};
