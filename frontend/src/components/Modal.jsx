import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({
  show,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Da',
  cancelText,
  type = 'warning'
}) => {
  if (!show) return null;

  // Determine header classes and styles based on type
  let headerClass = '';
  switch (type) {
    case 'success':
      headerClass = 'modal-header bg-success text-white';
      break;
    case 'danger':
      headerClass = 'modal-header bg-danger text-white';
      break;
    default:
      headerClass = 'modal-header bg-warning text-dark';
  }

  // Determine confirm button variant
  const confirmClass = type === 'success' ? 'btn btn-success compact me-2' : 'btn btn-danger compact me-2';

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className={headerClass}>
              <h5 className="modal-title text-white">{title}</h5>
            </div>
            <div className="modal-body text-center">
              {children}
            </div>
            <div className="modal-footer justify-content-center">
              {onConfirm && (
                <button
                  type="button"
                  className={confirmClass}
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
              )}
              { cancelText && onCancel && (
                  <button
                    type="button"
                    className="btn btn-secondary compact"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                  )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'success', 'danger'])
};

export default Modal;
