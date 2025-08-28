import { Loader2 } from 'lucide-react';

export function Spinner({ size = 24 }: { size?: number }) {
    return <Loader2 className={`animate-spin`} size={size} />;
}
