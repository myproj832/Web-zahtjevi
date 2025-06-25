function ActionButtons({ selectedRequest, handleDelete }) {
    return (
        <div className='d-none d-md-block'>
            <div className="d-flex justify-content-end gap-4 p-2">
                <button
                    className="btn btn-sm btn-outline-primary btn-light btn-30"
                    onClick={() => alert("Pregled zahtjeva")}
                >
                    🗎
                </button>

                <button
                    className="btn btn-sm btn-outline-warning btn-light btn-30"
                    onClick={() => alert("Izmijeni zahtjev")}
                >
                    🖉
                </button>

                <button
                    className="btn btn-sm btn-outline-danger btn-light btn-30"
                    onClick={() => handleDelete(selectedRequest.id)}
                >
                    🗑︎
                </button>

                <button className="btn btn-sm btn-outline-secondary btn-light btn-30">
                    🖶
                </button>
            </div>
        </div>
    );
}

export default ActionButtons;
