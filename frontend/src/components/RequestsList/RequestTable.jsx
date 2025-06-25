import React from "react";
import { Table } from "react-bootstrap";

function RequestTable({ filteredRequests, setSelectedRowId, selectedRowId }) {
  return (
    <Table bordered hover responsive className="bg-white shadow-sm">
      <thead>
        <tr>
          <th>Datum</th>
          <th>Pacijent / Telefon</th>
          <th>Tip recepta</th>
          <th>Lijek / Sastav</th>
          <th>Ustanova / Ljekar</th>
          <th>Status</th>
          <th>Napomena</th>
          <th>Farmaceut</th>
          <th>Datum izdavanja</th>
        </tr>
      </thead>

      <tbody>
        {filteredRequests.map((request) => (
          <tr
            key={request.id}
            className={request.id === selectedRowId ? "table-primary" : ""}
            onClick={() => setSelectedRowId(request.id)}
            style={{ cursor: "pointer" }}
          >
            <td>{request.datum}</td>
            <td>
              <div>{request.pacijent}</div>
              <div>{request.telefon}</div>
            </td>
            <td>{request.tipRecepta}</td>
            <td>
              <div>
                <strong>Lijek:</strong> {request.lijek}
              </div>
              <div
                className="p-1 rounded"
                style={{
                  maxHeight: "100px",
                  overflowY: "auto",
                }}
              >
                {/* Sastav ako je dostupan */}
              </div>
            </td>
            <td>
              <div>
                <strong>Ustanova:</strong> {request.ustanova}
              </div>
              <div>
                <strong>Ljekar:</strong> {request.ljekar}
              </div>
            </td>
            <td>
              <span
                className={`badge ${
                  request.status === "Kreiran"
                    ? "badge-status-kreiran"
                    : "badge-status-na-cekanju"
                }`}
              >
                {request.status}
              </span>
            </td>
            <td>{request.napomena || "—"}</td>
            <td>{request.farmaceut}</td>
            <td>{request.datumIzdavanja}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default RequestTable;
