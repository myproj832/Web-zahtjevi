import { Table } from "react-bootstrap";

function RequestTable({ filteredRequests, setSelectedRowId, selectedRowId, rola }) {
    return (
        <div className="d-none d-md-block">
            <Table bordered hover responsive className="bg-white shadow-sm">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Datum izdavanja</th>
                        <th>Pacijent / Telefon</th>
                        <th>Magistralni lijek</th>
                        <th>Izdao recept</th> {/*Podnosilac zahtjeva - Ustanova / rola(ljekar)*/}
                        <th>Prijem recepta</th> {/*Prijem/Odobravanje zahtjeva - Farmaceut / Prijem*/}
                        <th>Isporuka recepta</th> {/*Isporuka zahtjeva - Apoteka*/}
                        <th>Napomena</th>
                        <th>Rola</th>
                        <th>Status</th>
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
                            <td>{request.datumIzdavanja}</td>
                            <td>
                                <div className="text-capitalize">{request.pacijent}</div>
                                <div>{request.telefon}</div>
                            </td>
                            {/* <td></td> */}
                            <td>
                                <div><strong>Tip: </strong>{request.tipRecepta}</div>
                                <div className="text-capitalize">
                                    {request.lijek}
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
                            <td>{request.farmaceut}</td>
                            <td>Specija</td>
                            <td>{request.napomena || "—"}</td>
                            <td>{rola || "—"}</td>
                            <td>
                                <span
                                    className={`badge ${request.status === "Kreiran"
                                            ? "badge-status-kreiran"
                                            : "badge-status-na-cekanju"
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