export default function BoardPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <div className="text-sm text-zinc-500 mb-1">PROJECT</div>
        <h1 className="text-3xl font-bold gradient-text">The Board</h1>
      </div>
      
      <div className="glass-card rounded-xl p-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">Welcome to The Board</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          The Board is your simplified project, issue, and ticket tracking system. Manage tasks, bug reports, 
          and E2E test tasks. The AI can parse requirements from The Wiki to automatically generate tasks 
          and track development progress.
        </p>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-700 transition">
            Create Issue
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
            AI Ticket Extractor
          </button>
        </div>
      </div>
    </div>
  );
}
