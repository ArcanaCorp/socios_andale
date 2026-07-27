export default function BusinessInput({ label, value, onChange, placeholder, type = "text", maxLength }) {
    return (
        <div className="w-full flex flex-col gap-xs">
            <label className="text-sm text-semibold">{label}</label>
            <input type={type} value={value || ""} maxLength={maxLength} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="w-full bg-surface rounded-md p-sm text-sm outline-none"/>
        </div>
    );
}