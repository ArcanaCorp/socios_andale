'use client';

import { useParams } from "next/navigation";

export default function DishPage () {

    const { id } = useParams();

    return (
        <div className="w-full h-full py-md scroll-y">{id}</div>
    )
}