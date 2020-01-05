import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MediaLibrary from 'shared/components/mediaLibrary';
import { isOfType } from 'shared/helpers';

const MediaLibraryModal = ({ triggerComponent, onAssetSelect }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const onSelect = (asset) => {
    const { isImage } = isOfType(asset.type);

    if (isImage) {
      setIsOpen(!isOpen);
      onAssetSelect(asset);
    }
  }

  return (
    <>
      { triggerComponent &&
        <div onClick={toggleIsOpen}>
          { triggerComponent }
        </div>
      }

      { !triggerComponent &&
        <Button variant="outline-secondary" onClick={toggleIsOpen}>
          Select Image
        </Button>
      }
      
      <Modal 
        show={isOpen}
        onHide={toggleIsOpen}
        size="lg"
      >
        <Modal.Body>
          <MediaLibrary onAssetSelect={onSelect} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default MediaLibraryModal;