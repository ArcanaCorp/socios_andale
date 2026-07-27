export default function CardSchedule({ day, schedule, onChange }) {

    const currentDay = schedule?.[day.key] || DEFAULT_DAY;

    const updateDay = (field, value) => {
        onChange(day.key, {
            ...currentDay,
            [field]: value
        });
    };

    return (
        <div className="w-full flex flex-col gap-sm bg-surface rounded-md p-md">

            <div className="w-full flex items-center justify-between gap-md">
                <div className="flex flex-col gap-2xs">
                    <h4 className="text-sm text-semibold">{day.label}</h4>
                    <p className="text-xs text-muted">{currentDay.is_open ? `${currentDay.open} - ${currentDay.close}` : "Cerrado"}</p>
                </div>
                <button type="button" className={`rounded-full text-xs text-semibold px-md py-xs ${currentDay.is_open ? "bg-primary text-white" : "bg-white text-muted"}`} onClick={() => updateDay("is_open", !currentDay.is_open)}>{currentDay.is_open ? "Abierto" : "Cerrado"}</button>
            </div>

            {currentDay.is_open && (
                <div className="w-full grid gap-sm grid-cols-2">
                    <div className="w-full flex flex-col gap-xs">
                        <label className="text-xs text-semibold">Abre</label>
                        <input type="time" value={currentDay.open} onChange={(event) => updateDay("open", event.target.value)} className="w-full bg-white rounded-md p-sm text-sm outline-none"/>
                    </div>

                    <div className="w-full flex flex-col gap-xs">
                        <label className="text-xs text-semibold">Cierra</label>
                        <input type="time" value={currentDay.close} onChange={(event) => updateDay("close", event.target.value)} className="w-full bg-white rounded-md p-sm text-sm outline-none"/>
                    </div>
                </div>
            )}
        </div>
    );
}