import { OsmType } from "@/enums";

export interface NominatimEntity {
    place_id: number;
    licence: string;
    osm_type: OsmType;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name?: string;
    display_name: string;
    boundingbox: string[];
}

export interface NominatimByOsmId {
    address: {
        "ISO3166-2-lvl4": string,
        city: string,
        country: string,
        country_code: string,
        house_number: string,
        postcode: string,
        road: string,
        state: string,
        suburb: string,
    },
    addresstype: string,
    boundingbox: string[],
    class: string,
    display_name: string,
    //     extratags// :// { mvdgis: padron: '3742', mvdgis: cod_nombre: '2055' },
    importance: number,
    lat: string,
    licence: string,
    lon: string,
    name: string,
    osm_id: number,
    osm_type: OsmType,
    place_id: number,
    place_rank: number,
    type: string,
}