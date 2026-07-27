export default function BusinessSwitch ({label, description, checked, onChange}) {
    
    return (
    
        <button type="button" className="w-full flex items-center justify-between gap-md bg-surface rounded-md p-md text-left" onClick={() => onChange(!checked)} >
            
            <div className="w-full flex flex-col gap-2xs">
                <h4 className="text-sm text-semibold">{label}</h4>
                {description && ( <p className="text-xs text-muted">{description}</p>)}
            </div>

            <span className={`h rounded-full flex items-center px-2xs ${checked ? "bg-primary justify-end" : "bg-neutral-300 justify-start"}`} style={{ "--h": "26px", width: "48px", minWidth: "48px"}}>
                <span className="rounded-full bg-white" style={{ width: "20px", height: "20px"}}/>
            </span>
            
        </button>
    );
}