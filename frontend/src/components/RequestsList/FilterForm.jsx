function FilterForm({ filters, handleFilterChange, isAdmin }) {
  return (
    <div className="row g-2 mb-4">
      <div className="col-md-2 m-0">
        <label>Datum od:</label>
        <input
          type="date"
          className="form-control"
          name="datumOd"
          value={filters.datumOd}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-2 m-0">
        <label>Datum do:</label>
        <input
          type="date"
          className="form-control"
          name="datumDo"
          value={filters.datumDo}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-2 m-0">
        <label></label>
        <input
          type="text"
          className="form-control"
          placeholder="Pacijent / Telefon"
          name="pacijent"
          value={filters.pacijent}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-2 m-0">
        <label></label>
        <input
          type="text"
          className="form-control"
          placeholder="Lijek / Supstanca"
          name="lijek"
          value={filters.lijek}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-2 m-0">
        <label>Status:</label>
        <select
          className="form-control"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Svi statusi</option>
          <option value="0">Zaprimljen / Kreiran</option>
          <option value="1">Zaprimljen / Prihvaćen</option>
          <option value="4">Poništen / Odbijen</option>
          <option value="5">U izradi</option>
          <option value="6">Izrađen</option>
          <option value="2">Spreman za isporuku</option>
          <option value="3">Isporučen</option>
        </select>
      </div>

      <div className="col-md-2 m-0">
        <label>Rola:</label>
        <select
          disabled={!isAdmin}
          className="form-control"
          name="Rola"
          value={filters.rola}
          onChange={handleFilterChange}
        >
          {/* <option value="">Rola</option> */}
          <option value="Ljekar">Ljekar</option>
          <option value="Apotekar">Apotekar</option>
          <option value="Admin">Admin</option>
          <option value="Ustanova">Ustanova</option>
        </select>
      </div>
    </div>
  );
}

export default FilterForm;
