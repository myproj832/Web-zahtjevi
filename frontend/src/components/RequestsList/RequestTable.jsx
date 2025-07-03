import { Table } from "react-bootstrap";

function RequestTable({
  filteredRequests,
  setSelectedRowId,
  selectedRowId,
  rola,
}) {
  return (
    <div className="d-none d-md-block">
      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Datum izdavanja</th>
            <th>Pacijent / Telefon</th>
            <th>Magistralni lijek</th>
            <th>
              Izdao recept
              {/* Podnosilac zahtjeva - Ustanova / rola(ljekar) */}
            </th>
            <th>
              Prijem recepta
              {/* Prijem/Odobravanje zahtjeva - Farmaceut / Prijem */}
            </th>
            <th>
              Isporuka recepta
              {/* Isporuka zahtjeva - Apoteka */}
            </th>
            <th>Napomena</th>
            <th>Rola</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.map((request) => (
            <tr
              key={request.id_zah}
              className={
                request.id_zah === selectedRowId ? "table-primary" : ""
              }
              onClick={() => setSelectedRowId(request.id_zah)}
              style={{ cursor: "pointer" }}
            >
              <td>{request.dat_prijema}</td>
              <td>{request.rp?.[0]?.dat_izdavanja || "—"}</td>
              <td>
                <div className="text-capitalize">
                  {request.pacijent_ime} {request.pacijent_prezime}
                </div>
                <div>{/* telefon ako postoji */}</div>
              </td>
              <td>
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
              </td>
              <td>
                <div>
                  <strong>Ustanova:</strong> {request.izdao_recept_u}
                </div>
                <div>
                  <strong>Ljekar:</strong> {request.izdao_recept_lj}
                </div>
              </td>
              <td>{request.napomena_prijem || "—"}</td>
              <td>{request.dat_isporuke || "—"}</td>
              <td>{request.napomena_isporuka || "—"}</td>
              <td>{rola || "—"}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default RequestTable;
