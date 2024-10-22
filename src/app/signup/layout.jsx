export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main className="min-h-screen flex justify-center items-center">{children}</main>
      </body>
    </html>
  )
}