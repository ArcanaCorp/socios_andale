export default function BusinessImageField({ label, value, loading, aspect = "cover", onChange }) {
    
    const height = aspect === "avatar" ? "110px" : "170px";

    const handleChangeFile = (event) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            onChange(file);
        }
    }

    return (
        <div className="w-full flex flex-col gap-xs">
            <label className="text-sm text-semibold">{label}</label>

            <label className="relative w-full h rounded-md bg-surface center overflow-hidden pointer" style={{ "--h": height }}>
                {value ? (
                    <img src={value} alt={label} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full center flex-col gap-xs text-muted">
                        <span className="text-xl">+</span>
                        <p className="text-xs">Subir imagen</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset bg-overlay center">
                        <p className="text-xs text-white">Subiendo...</p>
                    </div>
                )}

                <input type="file" accept="image/*" hidden onChange={(event) => handleChangeFile(event)} />
            </label>
        </div>
    );
}