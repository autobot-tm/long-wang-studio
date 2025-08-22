'use client';
export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <html>
            <body className='p-6'>
                <div className='mx-auto max-w-lg text-center'>
                    <h1 className='mb-2 text-2xl font-semibold'>
                        Lỗi hệ thống
                    </h1>
                    <p className='mb-4 text-sm opacity-80'>{error.message}</p>
                    <button
                        className='rounded bg-black px-3 py-2 text-white'
                        onClick={() => reset()}
                    >
                        Thử lại
                    </button>
                </div>
            </body>
        </html>
    );
}
