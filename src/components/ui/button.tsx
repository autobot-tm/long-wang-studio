import { cn } from '@/libs/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
    [
        'cursor-pointer inline-flex items-center justify-center gap-2',
        'rounded-md font-medium transition-all select-none',
        'disabled:pointer-events-none disabled:opacity-50',
        'outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
        'whitespace-normal sm:whitespace-nowrap', // ✅ mobile cho wrap
        '[touch-action:manipulation]',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1.1em]', // ✅ icon theo text
    ].join(' '),
    {
        variants: {
            variant: {
                default:
                    'bg-accent text-primary-foreground shadow-xs hover:bg-primary/90',
                cta: 'bg-[#B6843A] text-white hover:opacity-90',
                destructive:
                    'bg-destructive text-white shadow-xs hover:bg-destructive/90',
                outline:
                    'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'min-h-[44px] h-11 px-4 text-[clamp(13px,3.4vw,14px)]',
                sm: 'min-h-[40px] h-10 px-3 text-[clamp(12px,3.2vw,13px)]',
                lg: 'min-h-[48px] h-12 px-6 text-[clamp(14px,3.6vw,16px)]',
                xl: [
                    // ✅ mobile lớn hơn + full control
                    'min-h-[48px] h-12 px-6 rounded-full',
                    'text-[clamp(12px,4.6svw,20px)]',
                    'sm:h-12 sm:px-7 md:h-14 md:px-8',
                ].join(' '),
                icon: 'size-9 rounded-md',
            },
            fullMobile: {
                true: 'w-full sm:w-auto', // ✅ full width ở mobile
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            fullMobile: false,
        },
    }
);

type ButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        textBg?: string;
    };

function Button({
    className,
    variant,
    size,
    asChild = false,
    textBg,
    fullMobile,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';
    const content = textBg ? (
        <span
            className='bg-clip-text text-transparent [-webkit-text-fill-color:transparent] leading-[1.15]'
            style={{
                backgroundImage: textBg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {children}
        </span>
    ) : (
        children
    );

    return (
        <Comp
            data-slot='button'
            className={cn(
                buttonVariants({ variant, size, fullMobile }),
                className
            )}
            {...props}
        >
            {content}
        </Comp>
    );
}

export { Button, buttonVariants };
