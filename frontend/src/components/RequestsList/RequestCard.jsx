import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";

function RequestCard({ request, rola, onSelect }) {
  const navigate = useNavigate();

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
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <div>
        <strong>ID zahtjeva:</strong> {request.id_zah}
      </div>
      <div>
        <strong>Datum recepta:</strong> {request.dat_prijema}
      </div>
      <div>
        <strong>Pacijent:</strong> {request.pacijent_ime}{" "}
        {request.pacijent_prezime}
      </div>
      <div>
        <strong>Telefon:</strong> {request.br_tel}
      </div>
      {/* Magistralni lijekovi in separate cards */}
      {request.rp?.map((rp, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #b1d9e0",
            borderRadius: "8px",
            background: "#f7fbff",
            padding: "12px",
            margin: "16px 0",
            boxShadow: "0 1px 4px #e3ffe755",
          }}
        >
          <div>
            <strong>Magistralni lijek:</strong>
          </div>
          <div>
            <strong>Tip:</strong>{" "}
            {rp.tip_rp === "OB" ? "Obrazac lijeka" : "Blanko obrazac"}
          </div>
          {rp.naziv !== "null" && (
            <div>
              <strong>Naziv:</strong> {rp.naziv}
            </div>
          )}
          <div
            className="p-1 rounded"
            style={{
              maxHeight: "100px",
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #e3ffe7",
              marginBottom: "8px",
            }}
          >
            {rp.rp_blanko !== "null" ? rp.rp_blanko : rp.rp_obrazac}
          </div>
        </div>
      ))}
      <div>
        <strong>Ustanova:</strong> {request.izdao_recept_u}
      </div>
      <div>
        <strong>Ljekar:</strong> {request.izdao_recept_lj}
      </div>
      <div>
        <strong>Lijek preuzeo:</strong> {request.isporuka_mg} <br />
        <strong>Datum isporuke:</strong> {request.dat_isporuke || "—"}
      </div>
      <div>
        <strong>Napomena:</strong> {request.napomena_isporuka || "—"}
      </div>
      <div
        style={{
          border: "1px solid #b1d9e0",
          borderRadius: "8px",
          background: "#f7fbff",
          padding: "12px",
          margin: "16px 0",
          boxShadow: "0 1px 4px #e3ffe755",
        }}
      >
        <strong>Barkod:</strong>

        {request.barcode ? (
          <Barcode
            value={request.barcode}
            width={1.5}
            height={35}
            fontSize={11}
            background="transparent"
          />
        ) : (
          "—"
        )}
      </div>
      <div>
        <strong>Status:</strong>{" "}
        <span
          className={`badge ${
            request.status === "0"
              ? "badge-status-kreiran"
              : request.status === "1"
              ? "badge-status-zaprimljen"
              : request.status === "4"
              ? "badge-status-odbijen"
              : request.status === "5"
              ? "badge-status-u-izradi"
              : request.status === "6"
              ? "badge-status-izradjen"
              : request.status === "2"
              ? "badge-status-spreman"
              : request.status === "3"
              ? "badge-status-isporucen"
              : ""
          }`}
        >
          {request.status === "0"
            ? "Kreiran"
            : request.status === "1"
            ? "Zaprimljen"
            : request.status === "4"
            ? "Odbijen"
            : request.status === "5"
            ? "U izradi"
            : request.status === "6"
            ? "Izrađen"
            : request.status === "2"
            ? "Spreman za isporuku"
            : request.status === "3"
            ? "Isporučen"
            : "Nepoznat"}
        </span>
      </div>
      <div className="mt-3 d-flex flex-wrap gap-1">
        <button
          className="btn btn-pregled p-2"
          onClick={() =>
            navigate(`/details/${request.id_zah}`, {
              state: { request: request },
            })
          }
        >
          Pregled&nbsp;🗎
        </button>
        {request.status === "1" && (
          <>
            <button
              className="btn btn-izmijeni p-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${request.id_zah}`);
              }}
            >
              Izmijeni
            </button>
            <button
              className="btn btn-obrisi btn-sm p-2"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    "Jeste li sigurni da želite da obrišete zahtjev?"
                  )
                ) {
                  alert("Zahtjev je sada pasivan (soft delete)");
                }
              }}
            >
              Obriši
            </button>
          </>
        )}
        <button className="btn btn-outline-secondary btn-sm p-2">Štampa</button>
      </div>
    </div>
  );
}

export default RequestCard;
