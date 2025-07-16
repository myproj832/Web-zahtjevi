import { Table } from "react-bootstrap";
import Barcode from "react-barcode";

function RequestTable({
  filteredRequests,
  setSelectedRowId,
  selectedRowId,
  rola,
  indexOfFirstRequest = 0,
}) {
  return (
    <div className="d-none d-md-block">
      <Table bordered hover responsive className="bg-white shadow-sm">
        <thead>
          <tr>
            <th>R.br.</th>
            <th>ID zahtjeva / Datum recepta</th>
            {/* <th>Datum izdavanja</th> */}
            <th>Pacijent / Telefon</th>
            <th>Magistralni lijek</th>
            <th>
              Ljekar / Zdravstvena ustanova
              {/* Podnosilac zahtjeva - Ustanova / rola(ljekar) */}
            </th>
            {/* <th>
              Lijek izradio - farmaceut
            </th> */}
            <th>
              Lijek preuzeo
              {/* Isporuka zahtjeva - Apoteka */}
            </th>
            <th>Napomena</th>
            <th>Barkod</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.map((request, idx) => (
            <tr
              key={request.id_zah}
              className={
                request.id_zah === selectedRowId ? "table-primary" : ""
              }
              onClick={() => setSelectedRowId(request.id_zah)}
              style={{ cursor: "pointer" }}
            >
              <td>{indexOfFirstRequest + idx + 1}</td>
              <td><strong>{request.id_zah}</strong> <br></br>{request.dat_prijema}</td>
              {/* <td>{request.rp?.[0]?.dat_izdavanja || "—"}</td> */}
              <td>
                <div className="text-capitalize">
                  {request.pacijent_ime} {request.pacijent_prezime}
                </div>
                <div>{request.br_tel}</div>
              </td>
              <td>
                {request.rp?.map((rp, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>Tip:</strong> {rp.tip_rp === "OB" ? "Obrazac lijeka" : "Blanko obrazac"} <br />
                    {rp.naziv !== "null" && <div className="pt-1">{rp.naziv}</div>}
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
              {/* <td>{request.napomena_prijem || "—"}</td> */}
              <td>{request.isporuka_mg} <br></br> <strong>{request.dat_isporuke || "—"}</strong></td>
              <td>{request.napomena_isporuka || "—"}</td>
              <td>
                {request.barcode ? (
                  <Barcode
                    value={request.barcode}
                    width={1}
                    height={35}
                    fontSize={11}
                    background="transparent"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>
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
                      : request.status === "7"
                      ? "badge-status-izmijenjen"
                       : request.status === "8"
                      ? "badge-status-storniran"
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
                    : request.status === "7"
                    ? "Izmijenjen"
                    : request.status === "8"
                    ? "Storniran"
                    : "Nepoznat"}
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
