'use client';

import { useAuthenticator, Card, Text, Heading, SearchField } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react-storage/styles.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, Plus, Upload, Trash2, Clock, LogOut, ChevronRight, User } from 'lucide-react';

// Mock data for documents
const MOCK_DOCS = [
  { id: '1', title: 'Project Overview.md', lastModified: '2026-03-20', size: '2.4 KB' },
  { id: '2', title: 'Ideas and Brainstorming.md', lastModified: '2026-03-22', size: '1.1 KB' },
  { id: '3', title: 'Personal Journal.md', lastModified: '2026-03-24', size: '5.8 KB' },
  { id: '4', title: 'NextJS Roadmap.md', lastModified: '2026-03-25', size: '3.2 KB' },
];

export default function DashboardPage() {
  const { user, signOut, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
  const router = useRouter();
  const [documents, setDocuments] = useState(MOCK_DOCS);
  const [showUpload, setShowUpload] = useState(false);

  // useEffect(() => {
  //   if (authStatus === 'unauthenticated') {
  //     router.push('/login');
  //   }
  // }, [authStatus, router]);

  // if (authStatus !== 'authenticated' || !user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-zinc-50 relative">
      {/* Floating User Profile Container */}
      <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 p-4 flex items-center gap-4 group hover:ring-2 hover:ring-primary/20 transition-all">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary border border-blue-100 group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
             <User size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 leading-none mb-1">
              {/* {user.username} */}
              User
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-semibold">
              Personal Space
            </span>
          </div>
          <div className="h-8 w-[1px] bg-zinc-100 mx-2" />
          <button 
            onClick={signOut}
            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area (Full Width) */}
      <main className="flex flex-col h-screen overflow-hidden">
        {/* Simplified Global Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-900">CloudNotes</h1>
           </div>

           <div className="flex items-center gap-6">
             <div className="w-80">
                <SearchField
                  label="Search"
                  placeholder="Find a document..."
                  size="small"
                  labelHidden
                />
             </div>
             <div className="h-6 w-[1px] bg-zinc-200" />
             <div className="flex items-center gap-3">
               <button 
                  onClick={() => setShowUpload(!showUpload)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 text-zinc-700 hover:border-primary/30 hover:bg-blue-50/50 rounded-xl text-sm font-bold transition-all"
                >
                  <Upload size={18} />
                  Upload
                </button>
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
                >
                  <Plus size={18} />
                  New Doc
                </button>
             </div>
           </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Your Dashboard</h2>
                  <p className="text-zinc-500 mt-1 font-medium italic">Manage your private markdown library</p>
               </div>
               <div className="flex gap-4">
                  <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                     <span className="text-xs font-bold text-blue-700 uppercase">{documents.length} Docs</span>
                  </div>
               </div>
            </div>

            {showUpload && (
              <div className="mb-12 bg-white p-8 rounded-3xl border-2 border-dashed border-blue-100 shadow-xl shadow-blue-500/5 animate-in zoom-in-95 duration-300 relative">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-3">
                     <div className="p-2 bg-blue-50 rounded-lg">
                       <Upload className="w-5 h-5 text-primary" />
                     </div>
                     Import Workspace
                   </h2>
                   <button 
                    onClick={() => setShowUpload(false)} 
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-full transition-colors"
                   >
                     <ChevronRight className="rotate-90 w-6 h-6" />
                   </button>
                </div>
                {/*THIS IS THE STORAGE DRAG AND DROP UPLOADER*/}
                {/*use the file path defined in amplify/storage/resource.ts*/}
                <StorageManager
                  acceptedFileTypes={['.md', 'text/markdown']}
                  maxFileCount={10}
                  
                  path={({ identityId }) => `note-files/${identityId}/`}
                  onUploadSuccess={({ key }) => {
                    setDocuments(prev => [{
                      id: Math.random().toString(),
                      title: key.split('/').pop() || 'new-file.md',
                      lastModified: new Date().toISOString().split('T')[0],
                      size: '0 KB'
                    }, ...prev]);
                  }}
                />
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                 <Text className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-3">Sync Status</Text>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600">
                      <Clock size={20} />
                    </div>
                    <Heading level={2} className="text-2xl font-bold text-zinc-900">Just Now</Heading>
                 </div>
              </div>
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                 <Text className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-3">Total Storage</Text>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                      <FileText size={20} />
                    </div>
                    <Heading level={2} className="text-2xl font-bold text-zinc-900">12.5 KB</Heading>
                 </div>
              </div>
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                 <Text className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-3">Recent Activity</Text>
                 <div className="flex items-center gap-3 text-zinc-900 font-bold">
                    Markdown edited
                 </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="group bg-white rounded-[2rem] border border-zinc-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-blue-50 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                        <FileText size={28} />
                      </div>
                      <button className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 truncate group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <Clock size={14} />
                      <span>Updated {doc.lastModified}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{doc.size}</span>
                    <div className="flex items-center gap-1 text-primary text-sm font-black opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      View <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100 text-center shadow-inner">
                   <div className="bg-zinc-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <FileText className="text-zinc-200 w-12 h-12" />
                   </div>
                   <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">Your library is empty</h3>
                   <p className="text-zinc-400 font-medium mt-2">Ready to create your first markdown masterpiece?</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
