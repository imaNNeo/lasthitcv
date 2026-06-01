interface Props {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function StringListInput({ label, items, onChange, placeholder }: Props) {
  return (
    <div className="string-list">
      <span className="field-label">{label}</span>
      {items.map((item, i) => (
        <div className="string-list-row" key={i}>
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))}
          />
          <button
            type="button"
            className="link-btn"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={() => onChange([...items, ''])}>
        + Add
      </button>
    </div>
  );
}
