export default function WikiPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <div className="text-sm text-zinc-500 mb-1">WORKSPACE</div>
        <h1 className="text-3xl font-bold gradient-text">The Wiki</h1>
      </div>
      
      <div className="glass-card rounded-xl p-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">Welcome to The Wiki</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          The Wiki is your central workspace for creating, editing, and managing your product documentation, 
          PRDs (Product Requirement Documents), and system specifications. 
          Use AI to draft content based on your ideas, review recommendations, and approve final documents.
        </p>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-700 transition">
            New Document
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
            AI Draft Generator
          </button>
        </div>
      </div>
    </div>
  );
}
