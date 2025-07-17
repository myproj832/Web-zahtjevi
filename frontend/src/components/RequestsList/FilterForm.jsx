import Select from "react-select";

function FilterForm({ filters, handleFilterChange, isAdmin, rola, listaUstanova }) {
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
      <div className="col-md-2 m-0 text-nowrap">
        <label>Ustanova:</label>
        <Select
          classNamePrefix="react-select"
          options={
            listaUstanova?.map((u) => ({ value: u, label: u })) || []
          }
          placeholder="Pretraga ustanove"
          name="ustanova"
          value={filters.ustanova ? { value: filters.ustanova, label: filters.ustanova } : null}
          onChange={(selected) => {
            handleFilterChange({
              target: {
                name: "ustanova",
                value: selected ? selected.value : ""
              }
            });
          }}
          isClearable
          isSearchable
        />
      </div>
      <div className="col-md-2 m-0">
        <label>Status:</label>
        <Select
          classNamePrefix="react-select"
          options={[
            { value: '', label: 'Svi statusi' },
            { value: '0', label: 'Kreiran', className: 'badge-status-kreiran' },
            { value: '7', label: 'Izmijenjen', className: 'badge-status-izmijenjen' },
            { value: '1', label: 'Zaprimljen / Prihvaćen', className: 'badge-status-zaprimljen' },
            { value: '9', label: 'Zaprimljen / Izmijenjen', className: 'badge-status-izm-far' },
            { value: '5', label: 'U izradi', className: 'badge-status-u-izradi' },
            { value: '6', label: 'Izrađen', className: 'badge-status-izradjen' },
            { value: '2', label: 'Spreman za isporuku', className: 'badge-status-spreman' },
            { value: '3', label: 'Isporučen', className: 'badge-status-isporucen' },
            { value: '4', label: 'Poništen / Odbijen', className: 'badge-status-odbijen' },
            { value: '8', label: 'Storniran', className: 'badge-status-storniran' },
          ]}
          name="status"
          value={(() => {
            const opts = [
              { value: '', label: 'Svi statusi' },
              { value: '0', label: 'Kreiran', className: 'badge-status-kreiran' },
              { value: '7', label: 'Izmijenjen', className: 'badge-status-izmijenjen' },
              { value: '1', label: 'Zaprimljen / Prihvaćen', className: 'badge-status-zaprimljen' },
              { value: '9', label: 'Zaprimljen / Izmijenjen', className: 'badge-status-izm-far' },
              { value: '5', label: 'U izradi', className: 'badge-status-u-izradi' },
              { value: '6', label: 'Izrađen', className: 'badge-status-izradjen' },
              { value: '2', label: 'Spreman za isporuku', className: 'badge-status-spreman' },
              { value: '3', label: 'Isporučen', className: 'badge-status-isporucen' },
              { value: '4', label: 'Poništen / Odbijen', className: 'badge-status-odbijen' },
              { value: '8', label: 'Storniran', className: 'badge-status-storniran' },
            ];
            return opts.find(o => o.value === filters.status) || opts[0];
          })()}
          onChange={selected => {
            handleFilterChange({
              target: {
                name: 'status',
                value: selected ? selected.value : ''
              }
            });
          }}
          isClearable={false}
          isSearchable={false}
          getOptionLabel={option =>
            option.value === ''
              ? option.label
              : (<span className={`badge legend ${option.className || ''}`}>{option.label}</span>)
          }
          formatOptionLabel={option =>
            option.value === ''
              ? option.label
              : (<span className={`badge legend ${option.className || ''}`}>{option.label}</span>)
          }
        />
      </div>

      {isAdmin ? (
        <div className="col-md-2 m-0">
          <label>Rola:</label>
          <select
            className="form-control"
            name="Rola"
            value={filters.rola || rola || ""}
            onChange={handleFilterChange}
          >
            <option value="Ljekar">Ljekar</option>
            <option value="Apotekar">Apotekar</option>
            <option value="Admin">Admin</option>
            <option value="Ustanova">Ustanova</option>
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default FilterForm;
