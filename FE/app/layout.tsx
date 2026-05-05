import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Legal Graph - Visual Law System Editor",
  description: "Create and manage relationships between legal documents with an interactive graph editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f5f5f5;
          }
          
          html, body, #__next {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
