import { ReactNode } from 'react';


interface LayoutProps {
    children: ReactNode; // Accept children passed to this layout
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en">
            <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
            </head>
        <body style={{backgroundColor: "#f4e8f0"}}>
        <main>{children}</main> {/* This will contain the page content */}
        </body>
        </html>
    );
}
