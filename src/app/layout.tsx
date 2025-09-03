import type { Metadata } from 'next';

import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';

const gilroy = localFont({
    src: [
        { path: '../../public/fonts/SVN-Gilroy-Regular.otf', weight: '400' },
        { path: '../../public/fonts/SVN-Gilroy-Medium.otf', weight: '500' },
        { path: '../../public/fonts/SVN-Gilroy-Bold.otf', weight: '700' },
    ],
    variable: '--font-gilroy',
});

const americana = localFont({
    src: [
        {
            path: '../../public/fonts/UTM-Americana.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/UTM-AmericanaB.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../public/fonts/UTM-AmericanaBEx.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/UTM-AmericanaItalic.ttf',
            weight: '800',
            style: 'normal',
        },
    ],
    variable: '--font-americana',
});
export const metadata: Metadata = {
    title: 'Long Wang',
    icons: {
        icon: '/images/main-logo.jpg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${gilroy.variable} ${americana.variable}`}>
                {children}
                <Toaster richColors closeButton position='top-center' />
            </body>
        </html>
    );
}
