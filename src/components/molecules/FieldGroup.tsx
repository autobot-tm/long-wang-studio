'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Field = {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
};
export default function FieldGroup({ field }: { field: Field }) {
    return (
        <div className='flex flex-col gap-2'>
            <Label htmlFor={field.name} className='text-sm font-medium'>
                {field.label}
            </Label>
            <Input
                id={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                required
            />
        </div>
    );
}
