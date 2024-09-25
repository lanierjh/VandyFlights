import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode; // Accept children passed to this layout
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en">
        <body>
        <main>{children}</main> {/* This will contain the page content */}
        </body>
        </html>
    );
}
