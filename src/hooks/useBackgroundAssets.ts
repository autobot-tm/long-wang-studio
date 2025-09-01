'use client';
import {
    deleteBackground,
    listBackgrounds,
    uploadBackground,
    type Asset,
} from '@/services/api/media.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useBackgroundAssets() {
    const qc = useQueryClient();
    const q = useQuery<Asset[]>({
        queryKey: ['assets', 'background'],
        queryFn: () => listBackgrounds(),
    });
    const uploadNew = useMutation({
        mutationFn: async (file: File) => {
            const cur = q.data?.[0];
            if (cur) await deleteBackground(cur.id);
            return uploadBackground(file);
        },
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['assets', 'background'] }),
    });
    const remove = useMutation({
        mutationFn: (id: string) => deleteBackground(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['assets', 'background'] }),
    });
    return { ...q, uploadNew, remove };
}
