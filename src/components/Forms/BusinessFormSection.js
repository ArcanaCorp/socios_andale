export default function BusinessFormSection({ title, description, children }) {
    
    return (
        <section className="w-full flex flex-col gap-md bg-white border-thin border-surface rounded-md p-md">
            <div className="w-full flex flex-col gap-2xs">
                <h3 className="text-md text-semibold">{title}</h3>
                {description && (
                    <p className="text-xs text-muted">{description}</p>
                )}
            </div>
            <div className="w-full flex flex-col gap-md">
                {children}
            </div>
        </section>
    );
}