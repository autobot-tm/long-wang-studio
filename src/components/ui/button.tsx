import { cn } from '@/libs/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
    "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    'bg-accent text-primary-foreground shadow-xs hover:bg-primary/90',
                cta: 'bg-[#B6843A] text-white hover:opacity-90',
                destructive:
                    'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
                outline:
                    'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-15 rounded-md px-8 py-4 has-[>svg]:px-4',
                xl: 'md:h-20 h-15 px-8 py-2 rounded-full text-[clamp(20px,5vw,40px)] font-semibold font-gilroy text-[32px]',
                icon: 'size-9 rounded-md',
            },
        },
        defaultVariants: { variant: 'default', size: 'default' },
    }
);

type ButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        /** CSS background-image cho text (vd: 'linear-gradient(...)' hoặc 'url(...)') */
        textBg?: string;
    };

function Button({
    className,
    variant,
    size,
    asChild = false,
    textBg,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';
    const content = textBg ? (
        <span
            className='bg-clip-text text-transparent [-webkit-text-fill-color:transparent]'
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
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {content}
        </Comp>
    );
}

export { Button, buttonVariants };
