'use client';

import { useState, } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PropertyType } from '../enums';
import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const useCreateReviewForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<{ osmId: string, position?: { lat: number, lon: number } } | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            propertyType: PropertyType.APARTMENT,
            description: '',
            agencyExperience: '',
            rating: 0,
            zoneRating: 0,
            winterComfort: '',
            summerComfort: '',
            humidity: '',
        },
    });

    const onSubmit = async (data: any) => {
        if (!selectedAddress) {
            toast.error('Por favor selecciona una dirección.');
            return;
        }
        setIsSubmitting(true);
        toast.loading('Publicando tu reseña...');
        try {
            const { error: insertError } = await supabase.from('reviews').insert({
                description: data.description,
                agency_experience: data.agencyExperience,
                rating: data.rating,
                zone_rating: data.zoneRating,
                property_type: data.propertyType,
                address_text: selectedAddress.display_name,
                winter_comfort: data.winterComfort,
                summer_comfort: data.summerComfort,
                humidity: data.humidity,
            });
            if (insertError) throw insertError;
            toast.dismiss();
            toast.success('¡Reseña publicada!');
            reset();
            redirect(PagesUrls.HOME);
        } catch (error) {
            toast.dismiss();
            toast.error('Error al publicar la reseña.', {
                description: error instanceof Error ? error.message : String(error),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        handleSubmit,
        onSubmit,
        setSelectedAddress,
        control,
        errors,
        isSubmitting,
        selectedAddress,
    };
};
