import type { SortBy } from "../types";

export interface Filters {
  category: string;
  date: string;
  availableOnly: boolean;
  sortBy: SortBy;
  asc: boolean;
}

interface FiltersBarProps {
  categories: string[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
}

const sortByValues = [
  
  { value: "date:false", text: "Newest" },
  { value: "date:true", text: "Oldest" },
  { value: "remaining:true", text: "Least remaining" },
  { value: "remaining:false", text: "Most remaining" },
  { value: "popularity:true", text: "Least popularity" },
  { value: "popularity:false", text: "Most popularity" },
];

export function FiltersBar({
  categories,
  filters,
  onChange,
  onClear,
}: FiltersBarProps) {
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

   
      <select
        value={
          filters.sortBy === "default"
            ? "default"
            : `${filters.sortBy}:${filters.asc}`
        }
        onChange={(e) => {
          const value = e.target.value;

        
          if (value === "default") {
            onChange({ ...filters, sortBy: "default", asc: true });
            return;
          }

        
          const [sortBy, asc] = value.split(":");
          if (
            sortBy === "date" ||
            sortBy === "remaining" ||
            sortBy === "popularity"
          ) {
            onChange({ ...filters, sortBy, asc: asc === "true" });
          }
        }}
      >
        
        <option value="default">Default</option>

        {sortByValues.map((e) => (
          <option key={e.value} value={e.value}>
            {e.text}
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