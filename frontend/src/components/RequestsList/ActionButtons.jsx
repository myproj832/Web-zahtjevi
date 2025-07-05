import { useNavigate } from "react-router-dom";

function ActionButtons({ selectedRequest, handleDelete }) {
  const navigate = useNavigate();

  return (
    <div className="d-none d-md-block">
      <div className="d-flex justify-content-end gap-4 p-2">
        <button
          className="btn btn-sm btn-outline-primary btn-light btn-30"
          onClick={() => navigate(`/details/${selectedRequest.id_zah}`, { state: { request: selectedRequest } })}
          disabled={!selectedRequest}
        >
          Pregled&nbsp;🗎
        </button>

        <button
          className="btn btn-sm btn-outline-warning btn-light btn-30"
          onClick={() => alert("Izmijeni zahtjev")}
        >
          Izmjeni&nbsp;🖉
        </button>

        <button
          className="btn btn-sm btn-outline-danger btn-light btn-30"
          onClick={() => handleDelete(selectedRequest.id)}
        >
          Obrisi&nbsp;🗑︎
        </button>

        <button className="btn btn-sm btn-outline-secondary btn-light btn-30">
          Stampaj&nbsp;🖶
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
