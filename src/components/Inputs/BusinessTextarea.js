export default function BusinessTextarea({ label, value, onChange, placeholder, rows = 4, maxLength }) {
    return (
        <div className="w-full flex flex-col gap-xs">
            <label className="text-sm text-semibold">{label}</label>
            <textarea value={value || ""} rows={rows} maxLength={maxLength} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full bg-surface rounded-md p-sm text-sm outline-none"/>
            {maxLength && (
                <p className="text-2xs text-muted text-right">{(value || "").length}/{maxLength}</p>
            )}
        </div>
    );
}