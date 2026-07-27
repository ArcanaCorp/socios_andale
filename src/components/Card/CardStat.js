export default function CardStat({ label, value, helper}) {
    return (
        <div className="w-full bg-white border-thin border-surface rounded-md p-md flex flex-col gap-xs">
            <p className="text-xs text-muted">{label}</p>
            <h3 className="text-xl text-semibold">{value}</h3>
            {helper && (
                <p className="text-2xs text-muted">{helper}</p>
            )}
        </div>
    );
}
