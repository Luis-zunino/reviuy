-- =============================================================================
-- MIGRACIÓN 1: ESTRUCTURA BASE DE REVIUY
-- Fecha: 09 de octubre de 2025
-- Descripción: Tablas principales y estructura base
-- =============================================================================
-- Tabla de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_by UUID REFERENCES auth.users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(name)
);

-- Tabla principal de reseñas de propiedades
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    real_estate_id UUID REFERENCES public.real_estates(id) ON DELETE
    SET
        NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        property_type TEXT CHECK (property_type IN ('apartment', 'house', 'room')),
        address_text TEXT,
        address_osm_id TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        zone_rating INTEGER CHECK (
            zone_rating >= 1
            AND zone_rating <= 5
        ),
        winter_comfort TEXT CHECK (winter_comfort IN ('hot', 'comfortable', 'cold')),
        summer_comfort TEXT CHECK (summer_comfort IN ('hot', 'comfortable', 'cold')),
        humidity TEXT CHECK (humidity IN ('high', 'normal', 'low')),
        likes INTEGER NOT NULL DEFAULT 0,
        dislikes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        apartment_number TEXT,
        real_estate_experience TEXT
);

-- Tabla de rooms asociados a reviews
CREATE TABLE IF NOT EXISTS public.review_rooms (
    id uuid primary key default gen_random_uuid(),
    review_id uuid not null references public.reviews(id) on delete cascade,
    room_type TEXT CHECK (room_type IN ( 'bedroom', 'living_room', 'kitchen', 'bathroom', 'dining_room', 'study', 'storage')),
    area_m2 numeric,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);