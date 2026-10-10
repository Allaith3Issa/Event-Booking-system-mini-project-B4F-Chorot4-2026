
export interface Filters {
  category: string;
  date: string;
  availableOnly: boolean;
}


interface FiltersBarProps {
  categories: string[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
}

export function FiltersBar({ categories, filters, onChange, onClear }: FiltersBarProps) {
  return (
    <div className="filters-bar">

    
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

    
      <input
        type="date"
        value={filters.date}
        onChange={(e) => onChange({ ...filters, date: e.target.value })}
      />

      
      <label className="filters-bar__check">
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(e) =>
            onChange({ ...filters, availableOnly: e.target.checked })
          }
        />
        Only with available places
      </label>

      
      <button type="button" onClick={onClear}>
        Clear filters
      </button>

    </div>
  );
}