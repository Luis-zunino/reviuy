import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';
import { useState } from 'react'

export const usePropertyFilters = () => {
    const [activeTab, setActiveTab] = useState<"address" | "realEstate">(
        "address"
    );
    const barrios = [
        "Ciudad Vieja",
        "Centro",
        "Barrio Sur",
        "Cordón",
        "Palermo",
        "Parque Rodó",
        "Punta Carretas",
        "Pocitos",
        "Buceo",
        "Parque Batlle, Villa Dolores",
        "Malvín",
        "Malvín Norte",
        "Punta Gorda",
        "Carrasco",
        "Carrasco Norte",
        "Bañados de Carrasco",
        "Maroñas, Parque Guaraní",
        "Flor de Maroñas",
        "Las Canteras",
        "Punta de Rieles, Bella Italia",
        "Jardines del Hipódromo",
        "Ituzaingó",
        "Unión",
        "Villa Española",
        "Mercado Modelo, Bolívar",
        "Castro, P. Castellanos",
        "Cerrito",
        "Las Acacias",
        "Aires Puros",
        "Casavalle",
        "Piedras Blancas",
        "Manga, Toledo Chico",
        "Paso de las Duranas",
        "Peñarol, Lavalleja",
        "Cerro",
        "Casabó, Pajas Blancas",
        "La Paloma, Tomkinson",
        "La Teja",
        "Prado, Nueva Savona",
        "Capurro, Bella Vista",
        "Aguada",
        "Reducto",
        "Atahualpa",
        "Jacinto Vera",
        "La Figurita",
        "Larrañaga",
        "La Blanqueada",
        "Villa Muñoz, Retiro",
        "La Comercial",
        "Tres Cruces",
        "Brazo Oriental",
        "Sayago",
        "Conciliación",
        "Belvedere",
        "Nuevo París",
        "Tres Ombúes, Victoria",
        "Paso de la Arena",
        "Colón Sureste, Abayubá",
        "Colón Centro y Noroeste",
        "Lezica, Melilla",
        "Villa Garcia, Manga Rural",
        "Manga",
    ];

    const handleFilterChange = ({ osmId }: { osmId: string }) => {
        redirect(`${PagesUrls.ADDREES_DETAILS}/${osmId}`)
    };

    return {
        activeTab, setActiveTab, handleFilterChange
    }

}

