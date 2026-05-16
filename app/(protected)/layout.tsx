import { Footer } from '@/components/footer/Footer';
import { Navbar } from '@/components/navbar/Navbar';
import React from 'react';

const AgreementLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <Navbar />
            <main className="grow flex flex-col items-center justify-center py-12 px-4">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default AgreementLayout;