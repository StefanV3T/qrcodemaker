import QrCodeGenerator from "./components/qrCodeGenerator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-2xl">
        <QrCodeGenerator />
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>A simple QR code generator built by <a href="https://www.stefanvet.nl/">Stefan Vet</a></p>
        </footer>
      </main>
    </div>
  );
}