function RequestCard({ request, rola, onSelect }) {
  return (
    <div
      onClick={() => onSelect?.(request.id_zah)}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        background: "#ffffffe9",
        cursor: "pointer",
      }}
    >
      <p><strong>Datum prijema:</strong> {request.dat_prijema}</p>
      <p><strong>Datum izdavanja:</strong> {request.rp?.[0]?.dat_izdavanja || "—"}</p>
      <p><strong>Pacijent:</strong> {request.pacijent_ime} {request.pacijent_prezime}</p>

      <div className="mb-2">
        <strong>Magistralni lijek:</strong>
        {request.rp?.map((rp, idx) => (
          <div key={idx} className="mb-2">
            <strong>Tip:</strong> {rp.tip_rp} <br />
            {rp.naziv !== "null" && <div>{rp.naziv}</div>}
            <div
              className="p-1 rounded"
              style={{
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {rp.rp_blanko !== "null" ? rp.rp_blanko : rp.rp_obrazac}
            </div>
          </div>
        ))}
      </div>

      <p><strong>Izdao recept:</strong></p>
      <ul className="mb-2 ps-3">
        <li><strong>Ustanova:</strong> {request.izdao_recept_u}</li>
        <li><strong>Ljekar:</strong> {request.izdao_recept_lj}</li>
      </ul>

      <p><strong>Prijem recepta:</strong> {request.napomena_prijem || "—"}</p>
      <p><strong>Isporuka recepta:</strong> {request.dat_isporuke || "—"}</p>
      <p><strong>Napomena:</strong> {request.napomena_isporuka || "—"}</p>
      <p><strong>Rola:</strong> {rola || "—"}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`badge ${
            request.status === "1"
              ? "badge-status-kreiran"
              : request.status === "2"
              ? "badge-status-na-cekanju"
              : "badge-status-odobren"
          }`}
        >
          {request.status}
        </span>
      </p>

      <div className="button-group mt-3 d-flex flex-wrap gap-2">
        <button className="btn btn-pregled btn-sm">Pregled</button>
        {request.status === "1" && (
          <>
            <button className="btn btn-izmijeni btn-sm">Izmijeni</button>
            <button
              className="btn btn-obrisi btn-sm"
              onClick={() => {
                if (window.confirm("Jeste li sigurni da želite da obrišete zahtjev?")) {
                  alert("Zahtjev je sada pasivan (soft delete)");
                }
              }}
            >
              Obriši
            </button>
          </>
        )}
        <button className="btn btn-outline-secondary btn-sm">Štampa</button>
      </div>
    </div>
  );
}

export default RequestCard;
