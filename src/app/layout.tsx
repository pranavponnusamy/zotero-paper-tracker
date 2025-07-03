import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Zotero Paper Tracker',
  description: 'Track the reading status of your Zotero papers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
