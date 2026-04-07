import Link from 'next/link';
import Navbar from './components/Navbar';
import { Lock, Zap, Shield, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="px-6 pb-20 pt-10 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-600/20 mb-8">
              New: Secure Markdown Editing v2.0
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              Your notes, <span className="text-primary italic">private</span> and everywhere.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
              A secure, minimalist markdown editor for your private thoughts. Powered by AWS Amplify for seamless synchronization across all your devices.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                Start Writing Now
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 bg-zinc-50/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Everything you need for secure editing
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <dt className="flex flex-col items-center gap-y-4">
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-base font-semibold leading-7 text-zinc-900">Private by Design</span>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                    <p className="flex-auto">All your documents are stored securely with individual encryption keys managed by AWS.</p>
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="flex flex-col items-center gap-y-4">
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-base font-semibold leading-7 text-zinc-900">Blazing Fast</span>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                    <p className="flex-auto">Real-time markdown preview is show as you type.</p>
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="flex flex-col items-center gap-y-4">
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-base font-semibold leading-7 text-zinc-900">AWS Powered</span>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                    <p className="flex-auto">Enterprise-grade security and reliability powered by AWS Amplify</p>
                  </dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="flex flex-col items-center gap-y-4">
                    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-base font-semibold leading-7 text-zinc-900">Markdown Magic</span>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                    <p className="flex-auto">Focus on content with a distraction-free rich text editor</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">About CloudNotes</h2>
                <p className="mt-6 text-lg leading-8 text-zinc-600">
                  CloudNotes was built with one goal in mind: providing a secure and seamless way to write and store markdown documents privately. Whether you&apos;re journaling, coding notes, or drafting your next big project, your data belongs to you.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium text-blue-900">&quot;The interface is so clean, I can finally focus on just writing.&quot;</p>
                    <p className="mt-2 text-xs text-blue-600">— Early Beta User</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-zinc-100 flex items-center justify-center p-8 overflow-hidden shadow-2xl shadow-blue-500/10 border border-zinc-200">
                  <div className="w-full h-full bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
                    <div className="h-2 w-1/3 bg-zinc-100 rounded-full" />
                    <div className="h-2 w-full bg-zinc-100 rounded-full" />
                    <div className="h-2 w-2/3 bg-zinc-100 rounded-full" />
                    <div className="h-2 w-full bg-zinc-100 rounded-full" />
                    <div className="mt-4 flex gap-2">
                       <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">#</div>
                       <div className="h-12 w-full bg-zinc-50 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-6 py-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-zinc-900">CloudNotes</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2026 CloudNotes. Built with AWS Amplify.
          </p>
        </div>
      </footer>
    </div>
  );
}
