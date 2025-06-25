function RequestCard({ request }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "#ffffffe9",
            }}
        >
            <p><strong>Datum podnošenja:</strong> {request.datum}</p>
            <p><strong>Pacijent:</strong> {request.pacijent}</p>
            <p><strong>Tip recepta:</strong> {request.tipRecepta}</p>
            <p><strong>Ustanova:</strong> {request.ustanova}</p>
            <p><strong>Ljekar:</strong> {request.ljekar}</p>
            <p><strong>Lijek:</strong> {request.lijek || "—"}</p>
            <div className="mt-2">
                <strong>Sastav:</strong>
                <ul className="mb-0 ps-3">
                    {request.sastav.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
            <p><strong>Status:</strong>
                <span
                    className={`badge ${request.status === "Kreiran" ? "badge-status-kreiran" : "badge-status-na-cekanju"}`}
                >
                    {request.status}
                </span>
            </p>
            <p><strong>Napomena:</strong> {request.napomena || "—"}</p>
            <p><strong>Farmaceut:</strong> {request.farmaceut}</p>
            <p><strong>Datum izdavanja lijeka:</strong> {request.datumIzdavanja}</p>
        </div>
    );
}

export default RequestCard;
