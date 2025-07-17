import { Table, Modal, Button } from "react-bootstrap";
import Barcode from "react-barcode";
import { useState } from "react";

function highlightDiff(original = "", changed = "") {
  if (!original || !changed) return changed;
  const origLines = original.split(/\r?\n/);
  const changedLines = changed.split(/\r?\n/);
  const maxLines = Math.max(origLines.length, changedLines.length);
  const result = [];
  for (let i = 0; i < maxLines; i++) {
    const origLine = origLines[i] || "";
    const changedLine = changedLines[i] || "";
    if (origLine === changedLine) {
      result.push(<div key={i}>{changedLine}</div>);
    } else {
     
      const origWords = origLine.split(/(\s+)/);
      const changedWords = changedLine.split(/(\s+)/);
      const maxWords = Math.max(origWords.length, changedWords.length);
      const line = [];
      for (let j = 0; j < maxWords; j++) {
        const ow = origWords[j] || "";
        const cw = changedWords[j] || "";
        if (ow === cw) {
          line.push(cw);
        } else if (cw) {
          line.push(
            <mark key={j} style={{ background: "#ffe066", color: "#b30000" }}>
              {cw}
            </mark>
          );
        }
      }
      result.push(<div key={i}>{line}</div>);
    }
  }
  return result;
}

function RequestTable({
  filteredRequests,
  setSelectedRowId,
  selectedRowId,
  rola,
  indexOfFirstRequest = 0,
}) {
  const [diffModal, setDiffModal] = useState({
    show: false,
    original: "",
    changed: "",
  });
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
              <td>
                <strong>{request.id_zah}</strong> <br></br>
                {request.dat_prijema}
              </td>
              {/* <td>{request.rp?.[0]?.dat_izdavanja || "—"}</td> */}
              <td>
                <div className="text-capitalize">
                  {request.pacijent_ime} {request.pacijent_prezime}
                </div>
                <div>{request.br_tel}</div>
              </td>
              <td>
                {request.rp?.map((rp, idx) => (
                  <div key={idx} className="mb-1">
                    <div className="d-flex flex-row justify-content-between pb-0 pt-1 m-0">
                      <div className="p-0 m-0">
                        <strong>Tip:</strong>{" "}
                        {rp.tip_rp === "OB"
                          ? "Obrazac lijeka"
                          : "Blanko obrazac"}
                      </div>

                      {rp.rp_obrazac !== rp.rp_obrazac_org && (
                        <div className="p-0 m-0 icon-diff"
                          title="Kliknite za prikaz izmjena"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDiffModal({
                              show: true,
                              original: rp.rp_obrazac_org,
                              changed: rp.rp_obrazac,
                            });
                          }}
                        >
                          !
                        </div>
                      )}
                    </div>
                    <br />
                    {rp.naziv !== "null" && (
                      <div className="pt-0 mt-0">{rp.naziv}</div>
                    )}
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
              <td>
                {request.isporuka_mg} <br></br>{" "}
                <strong>{request.dat_isporuke || "—"}</strong>
              </td>
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
                      : request.status === "9"
                      ? "badge-status-izm-far"
                      : ""
                  }`}
                >
                  {request.status === "0"
                    ? "Kreiran"
                    : request.status === "1"
                    ? "Zaprimljen / Prihvaćen"
                    : request.status === "4"
                    ? "Poništen / Odbijen"
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
                    : request.status === "9"
                    ? "Zaprimljen / Izmijenjen"
                    : "Nepoznat"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for showing diff between original and changed obrazac */}
      <Modal
        show={diffModal.show}
        onHide={() => setDiffModal({ show: false, original: "", changed: "" })}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Izmjene obrasca lijeka</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h6>Originalni obrazac lijeka</h6>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  minHeight: 80,
                }}
              >
                {diffModal.original || <i>Nema podataka</i>}
              </pre>
            </div>
            <div className="col-md-6">
              <h6>Izmijenjeni obrazac lijeka</h6>
              <pre
                style={{
                  background: "#fff3f3",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  minHeight: 80,
                }}
              >
                {diffModal.changed ? (
                  highlightDiff(diffModal.original, diffModal.changed)
                ) : (
                  <i>Nema podataka</i>
                )}
              </pre>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setDiffModal({ show: false, original: "", changed: "" })
            }
          >
            Zatvori
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestTable;
