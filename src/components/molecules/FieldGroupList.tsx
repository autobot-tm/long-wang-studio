'use client';
import FieldGroup, { Field } from './FieldGroup';
export default function FieldGroupList({ fields }: { fields: Field[] }) {
    return (
        <div className='flex flex-col gap-4'>
            {fields.map(f => (
                <FieldGroup key={f.name} field={f} />
            ))}
        </div>
    );
}
