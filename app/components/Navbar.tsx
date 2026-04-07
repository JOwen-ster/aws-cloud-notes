import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">CloudNotes</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link 
              href="#features" 
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#about" 
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/login" 
              className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
