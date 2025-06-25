import React from 'react';

function FilterForm({ filters, handleFilterChange }) {
  return (
    <div className="row g-2 mb-4">
      <div className="col-md-2">
        <label>Datum od:</label>
        <input
          type="date"
          className="form-control"
          name="datumOd"
          value={filters.datumOd}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-2">
        <label>Datum do:</label>
        <input
          type="date"
          className="form-control"
          name="datumDo"
          value={filters.datumDo}
          onChange={handleFilterChange}
        />
      </div>
      <div className="col-md-3">
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
      <div className="col-md-3">
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
      <div className="col-md-2">
        <label></label>
        <select
          className="form-control"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Status</option>
          <option value="Kreiran">Kreiran</option>
          <option value="Na čekanju">Na čekanju</option>
        </select>
      </div>
    </div>
  );
}

export default FilterForm;
