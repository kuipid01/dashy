import "../globals.css";
import NavbarProtected from "../(protected)/_components/navbar-protected";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`lg:px-15 pt-[calc(40px+7vh)] lg:pt-[calc(40px+10vh)] flex flex-col gap-5  md:px-8 px-5  bg-[#F7F7F8] min-h-screen antialiased`}>
        <NavbarProtected />
        {children}
      </body>
    </html>
  );
}
