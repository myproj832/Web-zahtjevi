import { useNavigate } from "react-router-dom";

function ActionButtons({ selectedRequest, handleDelete }) {
  const navigate = useNavigate();
  const canDelete = selectedRequest && (selectedRequest.status === "0" || selectedRequest.status === "7");

  return (
    <div className={`d-none d-md-block action-buttons`}>
      <div className="d-flex justify-content-end gap-1 p-2">
        <button
          className="btn btn-sm btn-outline-primary btn-light btn-30"
          onClick={() =>
            navigate(`/details/${selectedRequest.id_zah}`, {
              state: { request: selectedRequest },
            })
          }
          disabled={!selectedRequest}
        >
          Pregled&nbsp;🗎
        </button>

        <button
          className="btn btn-sm btn-outline-warning btn-light btn-30"
          onClick={() =>
            navigate(`/edit/${selectedRequest.id_zah}`, {
              state: { request: selectedRequest },
            })
          }
          disabled={!selectedRequest || !canDelete}
        >
          Izmijeni&nbsp;🖉
        </button>

        <button
          className="btn btn-sm btn-outline-danger btn-light btn-30"
          onClick={() => handleDelete(selectedRequest?.id_zah)}
          disabled={!canDelete}
        >
          Obrisi&nbsp;🗑︎
        </button>

        <button
          className="btn btn-sm btn-outline-secondary btn-light btn-30"
          onClick={() => {
            if (selectedRequest) {
              window.open(`/details/${selectedRequest.id_zah}?print=1`, "_blank");
            }
          }}
          disabled={!selectedRequest}
        >
          Stampaj&nbsp;🖶
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
