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
      <head>
        <script src="/js/treeview.js"></script>
        <script src="/js/breadcrumb.js"></script>
        <link rel="stylesheet" href="/js/treeview.css" />
        <link rel="stylesheet" href="/js/breadcrumb.css" />
      </head>
      <body>
        <Header />

        {children}
        <Footer />
      </body>
    </html>
  );
}
