    import * as React from 'react';
    import { cn } from '@/lib/utils';

    export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            {children}
            <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="text-sm text-gray-600 hover:underline">
                Cerrar
            </button>
            </div>
        </div>
        </div>
    );
    }

    export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
    }

    export function DialogContent({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
    }

    export function DialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="mt-4 flex justify-end gap-2">{children}</div>;
    }

    export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-2">{children}</div>;
    }
