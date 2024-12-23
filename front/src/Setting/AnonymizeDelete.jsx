import React, { useContext, useEffect, useRef } from 'react';
import './AnonymizeDelete.css';
import { AuthContext } from '../UserContext/Context';

const AnonymizeDelete = ({ isOpen, message, onConfirm, onCancel }) => {
  const {t} = useContext(AuthContext);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current.focus(); // Set focus to confirm button
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="modal-title" aria-hidden={!isOpen}>
      <div className="modal-content" aria-labelledby="modal-title">
        <h3 id="modal-title">{message}</h3>
        <div className="btn">
          <button
            onClick={onConfirm}
            className="btn-confirm"
            aria-label="Confirm action"
            ref={confirmButtonRef}
          >
            {t("Confirm")}
          </button>
          <button onClick={onCancel} className="btn-cancel" aria-label="Cancel action">
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnonymizeDelete;
