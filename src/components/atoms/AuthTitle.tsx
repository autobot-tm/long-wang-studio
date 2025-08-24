export default function AuthTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className='text-start text-2xl font-bold text-[#005841]'>
            {children}
        </p>
    );
}
