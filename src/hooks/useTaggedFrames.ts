'use client';
import {
    deleteFrame,
    listFramesByTag,
    selectFrame,
    uploadFramesWithTag,
    type Asset,
} from '@/services/api/media.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTaggedFrames(tag: 'frame' | 'popup', includePrivate = true) {
    const qc = useQueryClient();
    const key = ['assets', 'frames', tag];
    const q = useQuery<Asset[]>({
        queryKey: key,
        queryFn: () => listFramesByTag(tag, includePrivate),
    });
    const uploadMany = useMutation({
        mutationFn: (files: FileList) => uploadFramesWithTag(files, tag),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
    const remove = useMutation({
        mutationFn: (id: string) => deleteFrame(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
    const select = useMutation({
        mutationFn: (id: string) => selectFrame(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    });
    return { ...q, uploadMany, remove, select };
}
