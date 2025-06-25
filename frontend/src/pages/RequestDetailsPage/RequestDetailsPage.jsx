import { useParams, useNavigate } from "react-router-dom";

const DUMMY_REQUESTS = [
  {
    id: 1,
    datum: "24.05.2025 15:20",
    pacijent: "Marko Marković",
    tipRecepta: "Blanko",
    telefon: "38269344557",
    lijek: "Andol",
    sastav: ["Paracetamol 500mg", "3x dnevno", "Uzeti nakon obroka"],
    ustanova: "Dom zdravlja Beograd",
    ljekar: "Dr Ivana Ivković",
    status: "Kreiran",
    datumStatusa: "20.06.2025",
    napomena: "Doziranje po potrebi",
    faksimil: "Dr. MN",
    potpisFarmaceuta: "Petar Petrović",
    datumIzdavanja: "21.06.2025",
  },
];

function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const zahtjev = DUMMY_REQUESTS.find((r) => r.id === parseInt(id));

  if (!zahtjev) {
    return <div className="p-4">Zahtjev nije pronađen.</div>;
  }

  return (
    <div className="p-4 background">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ⬅ Nazad
      </button>

      <h3>Detalji zahtjeva #{zahtjev.id}</h3>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Datum</th>
            <td>{zahtjev.datum}</td>
          </tr>
          <tr>
            <th>Pacijent</th>
            <td>{zahtjev.pacijent}</td>
          </tr>
          <tr>
            <th>Telefon</th>
            <td>{zahtjev.telefon}</td>
          </tr>
          <tr>
            <th>Tip recepta</th>
            <td>{zahtjev.tipRecepta}</td>
          </tr>
          <tr>
            <th>Lijek</th>
            <td>{zahtjev.lijek}</td>
          </tr>
          {zahtjev.tipRecepta === "Blanko forma" && (
            <tr>
              <th>Sastav</th>
              <td>
                <ul>
                  {zahtjev.sastav.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          <tr>
            <th>Ustanova</th>
            <td>{zahtjev.ustanova}</td>
          </tr>
          <tr>
            <th>Ljekar</th>
            <td>{zahtjev.ljekar}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{zahtjev.status}</td>
          </tr>
          <tr>
            <th>Datum statusa</th>
            <td>{zahtjev.datumStatusa}</td>
          </tr>
          <tr>
            <th>Napomena</th>
            <td>{zahtjev.napomena}</td>
          </tr>
          <tr>
            <th>Faksimil</th>
            <td>{zahtjev.faksimil}</td>
          </tr>
          <tr>
            <th>Potpis farmaceuta</th>
            <td>{zahtjev.potpisFarmaceuta}</td>
          </tr>
          <tr>
            <th>Datum izdavanja</th>
            <td>{zahtjev.datumIzdavanja}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RequestDetailsPage;
