export default function SearchBar({
  value,
  onChange,
  placeholder = "Search terms...",
  label = "Search",
}) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="term-search">
        {label}
      </label>
      <input
        id="term-search"
        className="search-bar__input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}