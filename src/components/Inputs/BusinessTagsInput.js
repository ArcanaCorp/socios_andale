'use client';

import { useState } from "react";
import Icons from "../Icons/Icons";

export default function BusinessTagsInput({ label, value = [], onChange, placeholder = "Ej. café, familiar, criollo" }) {

    const [tag, setTag] = useState("");

    const tags = Array.isArray(value) ? value : [];

    const addTag = () => {
        const cleanTag = tag.trim().toLowerCase();

        if (!cleanTag) return;

        if (tags.includes(cleanTag)) {
            setTag("");
            return;
        }

        onChange([...tags, cleanTag]);
        setTag("");
    };

    const removeTag = (tagToRemove) => {
        onChange(
            tags.filter((item) => item !== tagToRemove)
        );
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag();
        }
    };

    return (
        <div className="w-full flex flex-col gap-xs">
            <label className="text-sm text-semibold">{label}</label>
            <div className="w-full flex gap-xs">
                <input type="text" value={tag} placeholder={placeholder} onChange={(event) => setTag(event.target.value)} onKeyDown={handleKeyDown} className="w-full bg-surface rounded-md p-sm text-sm outline-none" />
                <button type="button" className="h bg-primary text-white rounded-md px-md text-xs text-semibold" style={{ "--h": "38px" }} onClick={addTag} >Agregar</button>
            </div>

            {tags.length > 0 && (
                <ul className="w-full flex flex-wrap gap-xs mt-xs">
                    {tags.map((item) => (
                        <li key={item} className="badge flex items-center gap-xs">
                            <span>{item}</span>
                            <button type="button" className="text-danger" onClick={() => removeTag(item)} ><Icons name={'close'} /></button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}