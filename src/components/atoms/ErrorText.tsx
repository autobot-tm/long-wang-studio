export default function ErrorText({ msg }: { msg?: string | null }) {
    if (!msg) return null;
    return <p className='text-red-600 text-sm'>{msg}</p>;
}
