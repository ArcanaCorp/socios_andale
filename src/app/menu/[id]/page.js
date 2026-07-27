'use client';

import Icons from "@/components/Icons/Icons";
import Loading from "@/components/views/Loading";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { formatMoney } from "@/helpers/formatted.helper";
import { useEditDish } from "@/hooks/useEditDish";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DishPage () {

    const router = useRouter();
    const { id } = useParams();

    const { activeBusiness, loadingBusinessAccess } = useBusinessAccess();

    const foodieId = activeBusiness?.id;

    const { dish, categories, form, loadingDish, loadingCategories, saving, deleting, updateForm, selectImage, saveDish, deleteDish } = useEditDish({ dishId: id, foodieId });

    const handleSave = async () => {
        const result = await saveDish();
        if (!result.ok) return toast.warning("Alerta", { description: result.message});
            toast.success("Plato actualizado", { description: result.message });
            router.push("/menu");
    };

    const handleDelete = async () => {
        
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar este plato?");

        if (!confirmDelete) return;

        const result = await deleteDish();

        if (!result.ok) return toast.warning("Alerta", { description: result.message });

            toast.success("Plato eliminado", { description: result.message });
            router.push("/menu");
    };

    if (loadingBusinessAccess || loadingDish) {
        return <Loading />;
    }

    if (!activeBusiness) {
        return (
            <main className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">
                    No tienes un negocio activo.
                </p>
            </main>
        );
    }

    if (!dish) {
        return (
            <main className="w-full h-full grid-center p-md">
                <div className="w-full flex flex-col gap-md text-center">
                    <p className="text-sm text-muted">No se encontró el plato o no pertenece a tu negocio.</p>
                    <button type="button" className="text-sm text-primary text-semibold" onClick={() => router.push("/menu")}>Volver al menú</button>
                </div>
            </main>
        );
    }

    const currentImage = form.image_preview || form.image_url || null;

    return (
        <div className="w-full h-full py-md scroll-y">

            <button className="btn-float" onClick={handleDelete} disabled={deleting}>{deleting ? 'Eliminando...' : <Icons name={'trash'}/>}</button>

            <section className="w-full flex flex-col gap-md px-md">

                <div className="w-full flex flex-col gap-sm">
                    <h4 className="text-md text-semibold">Imagen del plato</h4>
                    <label htmlFor="dish-image" className="relative w-full h rounded-md bg-surface center pointer overflow-hidden" style={{"--h": "180px"}}>
                        {currentImage ? (
                            <img src={currentImage} alt={form.name || "Imagen del plato"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-xs text-muted">
                                <Icons name="camera" size={24} strokeWidth={1.2}/>
                                <p className="text-xs">Toca para subir una imagen</p>
                            </div>
                        )}
                        <input id="dish-image" type="file" accept="image/*" hidden onChange={(event) => { const file = event.target.files?.[0] || null; selectImage(file); }} />
                    </label>
                </div>

                <div className="w-full flex flex-col gap-sm">
                    <label className="text-sm text-semibold">Nombre del plato</label>
                    <input type="text" className="w-full bg-surface rounded-md p-sm text-sm outline-none" placeholder="Ej. Latte, Chicharrón, Hamburguesa..." value={form.name} onChange={(event) => updateForm("name", event.target.value) } />
                </div>

                <div className="w-full flex flex-col gap-sm">
                    <label className="text-sm text-semibold">Descripción</label>
                    <textarea className="w-full bg-surface rounded-md p-sm text-sm outline-none" placeholder="Describe brevemente el plato" rows={4} value={form.description} onChange={(event) => updateForm("description", event.target.value) } />
                </div>

                <div className="w-full flex flex-col gap-sm">
                    <label className="text-sm text-semibold">Precio</label>
                    <div className="w-full flex items-center gap-sm bg-surface rounded-md px-sm">
                        <span className="text-sm text-muted">S/</span>
                        <input type="number" min="0" step="0.10" className="w-full bg-transparent py-sm text-sm outline-none" placeholder="0.00" value={form.price} onChange={(event) => updateForm("price", event.target.value)} />
                    </div>
                    {form.price !== "" && (
                        <p className="text-xs text-muted">Precio actual:{" "}<b>S/ {formatMoney(Number(form.price) || 0)}</b></p>
                    )}
                </div>

                <div className="w-full flex flex-col gap-sm">
                    <label className="text-sm text-semibold">Categoría</label>
                    <select className="w-full bg-surface rounded-md p-sm text-sm outline-none" value={form.category_id} onChange={(event) => updateForm("category_id", event.target.value)} disabled={loadingCategories} >
                        <option value="">Sin categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <input type="text" className="w-full bg-surface rounded-md p-sm text-sm outline-none" placeholder="O crea una nueva categoría" value={form.new_category} onChange={(event) => updateForm("new_category", event.target.value)} />
                    {form.new_category && (
                        <p className="text-xs text-muted">Se creará la categoría{" "}<b>{form.new_category}</b> y el plato semoverá ahí.</p>
                    )}
                </div>

                <div className="w-full flex items-center justify-between bg-surface rounded-md p-md">
                    <div>
                        <h4 className="text-sm text-semibold">Disponible</h4>
                        <p className="text-xs text-muted">Si está apagado, el plato no se podrá pedir.</p>
                    </div>    
                    <button type="button" className={`rounded-full text-xs text-semibold px-md py-sm ${form.is_available ? "bg-primary text-white" : "bg-white text-muted"}`} onClick={() => updateForm("is_available",!form.is_available)}>
                        {form.is_available ? "Activo" : "Oculto"}
                    </button>
                </div>

                <div className="w-full">
                    <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{"--h": "42px"}} onClick={handleSave} disabled={saving}>
                        {saving ? "Guardando cambios..." : "Guardar cambios"}
                    </button>
                </div>

            </section>

        </div>
    )
}