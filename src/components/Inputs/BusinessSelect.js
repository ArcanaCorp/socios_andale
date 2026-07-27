export default function BusinessSelect({label,value,onChange,options = []}) {
    return (
        <div className="w-full flex flex-col gap-xs">
            <label className="text-sm text-semibold">{label}</label>
            <select value={value || ""} onChange={(event) => onChange(event.target.value)} className="w-full bg-surface rounded-md p-sm text-sm outline-none">
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}