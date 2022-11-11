import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalContainer } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ src, alt, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = event => {
    if (event.code === 'Escape') onClose();
  };

  const handleBackdropClick = event => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalContainer>
        <img src={src} alt={alt} />
      </ModalContainer>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
