'use client';

import { useEffect } from 'react';
import { defineCustomElements } from '@scania/tegel-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    defineCustomElements();
  }, []);

  return (
    <html lang="en">
      <body>
        <Header />
        <div className="tds-container">
          <div className="tds-row tds-margin-bottom-4">
            <div className="tds-col-max-12">
              <Breadcrumbs items={[{ label: 'Home', href: '/', current: false }, { label: 'Page', href: '/page', current: true }]} />
            </div>
          </div>
          
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
