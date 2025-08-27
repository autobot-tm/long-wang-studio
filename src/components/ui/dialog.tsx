'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/libs/utils';

function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot='dialog' {...props} />;
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot='dialog-overlay'
            className={cn(
                // default z-50
                'data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50 bg-black/50',
                className
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    fitContent = false,
    centerByGrid = false,
    overlayClassName,
    zIndex = 60,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    fitContent?: boolean;
    centerByGrid?: boolean;
    overlayClassName?: string;
    zIndex?: number;
}) {
    const base = cn(
        'bg-background grid gap-4 rounded-lg border p-6 shadow-lg duration-200',
        fitContent &&
            'w-auto max-w-none p-0 shadow-none border-0 bg-transparent'
    );

    const CloseBtn = showCloseButton ? (
        <DialogPrimitive.Close asChild>
            <button
                type='button'
                aria-label='Close'
                className='absolute right-4 top-4 inline-flex size-8 items-center justify-center
                 rounded-full bg-black/30 text-white hover:bg-black/40 pointer-events-auto'
                style={{ zIndex: (zIndex ?? 60) + 3 }}
            >
                <XIcon />
            </button>
        </DialogPrimitive.Close>
    ) : null;

    return (
        <DialogPortal>
            {/* overlay luôn dưới content */}
            <DialogOverlay
                className={cn('fixed inset-0 bg-black/50', overlayClassName)}
                style={{ zIndex }}
            />

            {centerByGrid ? (
                <div
                    className='fixed inset-0 grid place-items-center'
                    style={{ zIndex: zIndex + 1 }}
                >
                    <DialogPrimitive.Content
                        className={cn(base, className, 'relative')} // relative để z-index con hoạt động
                        style={{ zIndex: zIndex + 2 }}
                        {...props}
                    >
                        {children}
                        {CloseBtn}
                    </DialogPrimitive.Content>
                </div>
            ) : (
                <DialogPrimitive.Content
                    className={cn(
                        base,
                        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative',
                        className
                    )}
                    style={{ zIndex: zIndex + 2 }}
                    {...props}
                >
                    {children}
                    {CloseBtn}
                </DialogPrimitive.Content>
            )}
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='dialog-header'
            className={cn(
                'flex flex-col gap-2 text-center sm:text-left',
                className
            )}
            {...props}
        />
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='dialog-footer'
            className={cn(
                'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
                className
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot='dialog-title'
            className={cn('text-lg leading-none font-semibold', className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot='dialog-description'
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
