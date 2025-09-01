'use client';
import {
    deleteFrame,
    listFramesByTag,
    uploadFramesWithTag,
    type Asset,
} from '@/services/api/media.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTaggedFrames(tag: 'frame' | 'popup') {
    const qc = useQueryClient();
    const key = ['assets', 'frames', tag];
    const q = useQuery<Asset[]>({
        queryKey: key,
        queryFn: () => listFramesByTag(tag),
    });
    const uploadMany = useMutation({
        mutationFn: (files: FileList) => uploadFramesWithTag(files, tag),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
    const remove = useMutation({
        mutationFn: (id: string) => deleteFrame(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
    return { ...q, uploadMany, remove };
}
