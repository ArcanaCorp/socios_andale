export default function CardStatus({ label, description, active, activeText = "Activo", inactiveText = "Inactivo" }) {

    return (
        <div className="w-full flex items-center justify-between gap-md bg-surface rounded-md p-md">
            <div className="w-full flex flex-col gap-2xs">
                <h4 className="text-sm text-semibold">{label}</h4>
                {description && (
                    <p className="text-xs text-muted">{description}</p>
                )}
            </div>
            <span className={`text-xs text-semibold rounded-full px-sm py-2xs ${active ? "bg-primary text-white" : "bg-white text-muted"}`}>
                {active ? activeText : inactiveText}
            </span>
        </div>
    );
}