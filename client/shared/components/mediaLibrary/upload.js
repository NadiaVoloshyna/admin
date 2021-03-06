import React, { useEffect, useState } from 'react';
import { func, string, number } from 'prop-types';
import Button from 'react-bootstrap/Button';
import { createUploadWidget } from 'shared/third-party/upload';

const CloudinaryUpload = ({ onSuccess, onError, btnText, width, height }) => {
  const [widget, setWidget] = useState(null);
  const [image, setImage] = useState(null);

  const onImageUpload = (image) => {
    setImage(image);
    onSuccess(image);
  };

  useEffect(() => {
    const uploadWidjet = createUploadWidget(onImageUpload, onError);
    setWidget(uploadWidjet);
  }, []);

  const onShow = () => {
    widget.open();
  };

  return (
    <div className="cloudinary-upload img-thumbnail">
      { !!image && <img src={image.url} alt={image.name} /> }
      <Button
        variant="outline-secondary"
        onClick={onShow}
      >
        { btnText }
      </Button>

      <style global jsx>{`
        .cloudinary-upload {
          position: relative;
          width: ${width || height || 200}px;
          height: ${height || width || 200}px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cloudinary-upload button {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .cloudinary-upload img {
          max-width: 100%;
          height: auto;
          max-height: 100%;
        }
      `}</style>
    </div>
  );
};

CloudinaryUpload.propTypes = {
  onSuccess: func,
  onError: func,
  btnText: string,
  width: number,
  height: number,
};

CloudinaryUpload.defaultProps = {
  onSuccess: () => {},
  onError: () => {},
  btnText: 'Open Assets',
  width: 0,
  height: 0,
};

export default CloudinaryUpload;
