import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Disable caching to ensure real-time metrics

export default async function HomePage() {
  // Read active project from cookies
  const cookieStore = await cookies();
  let activeProjectId = cookieStore.get("active_project_id")?.value || null;

  let activeProjectName = "No Project";
  let wikiCount = 0;
  let canvasCount = 0;
  let issueCount = 0;
  let todoCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;
  let testRunCount = 0;
  let passedTestRuns = 0;
  let failedTestRuns = 0;
  
  let recentDocs: any[] = [];
  let recentRuns: any[] = [];

  try {
    const projects = await prisma.project.findMany({ select: { id: true, name: true } });
    
    if (projects.length > 0) {
      const activeProjectExists = projects.some((p) => p.id === activeProjectId);
      if (!activeProjectId || !activeProjectExists) {
        activeProjectId = projects[0].id;
      }
      activeProjectName = projects.find((p) => p.id === activeProjectId)?.name || "No Project";
      
      // Fetch stats for active project
      wikiCount = await prisma.document.count({ where: { projectId: activeProjectId } });
      canvasCount = await prisma.canvas.count({ where: { projectId: activeProjectId } });
      issueCount = await prisma.issue.count({ where: { projectId: activeProjectId } });
      todoCount = await prisma.issue.count({ where: { projectId: activeProjectId, status: "TODO" } });
      inProgressCount = await prisma.issue.count({ where: { projectId: activeProjectId, status: "IN_PROGRESS" } });
      doneCount = await prisma.issue.count({ where: { projectId: activeProjectId, status: "DONE" } });
      
      testRunCount = await prisma.testRun.count({ 
        where: { testScenario: { projectId: activeProjectId } } 
      });
      passedTestRuns = await prisma.testRun.count({ 
        where: { status: "PASSED", testScenario: { projectId: activeProjectId } } 
      });
      failedTestRuns = await prisma.testRun.count({ 
        where: { status: "FAILED", testScenario: { projectId: activeProjectId } } 
      });

      recentDocs = await prisma.document.findMany({
        where: { projectId: activeProjectId },
        take: 3,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        }
      });

      recentRuns = await prisma.testRun.findMany({
        where: { testScenario: { projectId: activeProjectId } },
        take: 3,
        orderBy: { executedAt: "desc" },
        include: {
          testScenario: {
            select: {
              title: true
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch database metrics:", error);
  }

  // Calculate percentages
  const boardProgressPercent = issueCount > 0 ? Math.round((doneCount / issueCount) * 100) : 0;
  const testPassPercent = testRunCount > 0 ? Math.round((passedTestRuns / testRunCount) * 100) : 0;

  return (
    <div className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 glow-backdrop">
        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 w-fit">
            <span>📁 Active Project: {activeProjectName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="gradient-accent-text">Monolith</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Your unified, local-first development workspace. Document requirement sheets, map whiteboard design components, 
            delegate task boards, and execute quality assurance checks in one connected ecosystem.
          </p>
        </div>
        
        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 gap-4 shrink-0 z-10 w-full md:w-auto">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">The Wiki</span>
            <span className="text-2xl font-semibold text-white">{wikiCount} Docs</span>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-1">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">The Board</span>
            <span className="text-2xl font-semibold text-white">{issueCount} Tickets</span>
          </div>
        </div>
      </div>

      {/* Core Pillar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Pillar 1: The Wiki */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between min-h-[200px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-indigo-400 p-2 bg-indigo-900/10 border border-indigo-500/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="text-[10px] uppercase font-mono text-zinc-500">Documentation</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">The Wiki</h2>
              <p className="text-xs text-zinc-400 mt-1">AI-assisted product specifications & PRD documents.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm font-semibold text-white">{wikiCount} documents</span>
            <Link href="/wiki" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Open <span>→</span>
            </Link>
          </div>
        </div>

        {/* Pillar 2: The Canvas */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between min-h-[200px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 p-2 bg-amber-900/10 border border-amber-500/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-[10px] uppercase font-mono text-zinc-500">Design</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">The Canvas</h2>
              <p className="text-xs text-zinc-400 mt-1">Vector-based drawing board for whiteboard layouts.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm font-semibold text-white">{canvasCount} boards</span>
            <Link href="/canvas" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Open <span>→</span>
            </Link>
          </div>
        </div>

        {/* Pillar 3: The Board */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between min-h-[200px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 p-2 bg-cyan-900/10 border border-cyan-500/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              <span className="text-[10px] uppercase font-mono text-zinc-500">Tracking</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">The Board</h2>
              <p className="text-xs text-zinc-400 mt-1">Track tasks, tickets, and bugs generated from code.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-semibold">{doneCount} / {issueCount} completed</span>
              <span className="text-white font-bold">{boardProgressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${boardProgressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/board" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Open <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pillar 4: The Laboratory */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between min-h-[200px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 p-2 bg-emerald-900/10 border border-emerald-500/10 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              <span className="text-[10px] uppercase font-mono text-zinc-500">Testing</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">The Laboratory</h2>
              <p className="text-xs text-zinc-400 mt-1">Create test steps, run checks, and log bugs.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-semibold">{passedTestRuns} Passed / {testRunCount} Runs</span>
              <span className="text-white font-bold">{testPassPercent}% Pass</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${testPassPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/laboratory" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Open <span>→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Two Columns Section: Recent Items & Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Recent Items Overview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-zinc-200">Recent Workspace Updates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Wiki Docs */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-500">Latest Documents</h4>
              {recentDocs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recentDocs.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col gap-0.5">
                        <Link href="/wiki" className="text-sm text-zinc-200 hover:text-indigo-400 font-medium transition line-clamp-1">
                          {doc.title}
                        </Link>
                        <span className="text-[10px] text-zinc-500">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        doc.status === "APPROVED" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-zinc-500 italic py-4">No documents found. Click "Draft PRD" below to start.</div>
              )}
            </div>

            {/* Recent Test Runs */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-500">Latest Test Runs</h4>
              {recentRuns.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recentRuns.map((run) => (
                    <div key={run.id} className="flex justify-between items-center border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex flex-col gap-0.5">
                        <Link href="/laboratory" className="text-sm text-zinc-200 hover:text-emerald-400 font-medium transition line-clamp-1">
                          {run.testScenario?.title || "Test Run"}
                        </Link>
                        <span className="text-[10px] text-zinc-500">{new Date(run.executedAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        run.status === "PASSED" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {run.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-zinc-500 italic py-4">No test runs executed yet.</div>
              )}
            </div>

          </div>
        </div>

        {/* Column 3: Quick Action Panel */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-zinc-200">Quick AI Actions</h3>
          
          <div className="glass-panel rounded-xl p-5 flex flex-col gap-3.5">
            <button className="w-full text-left p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/40 transition group flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 transition">Draft PRD with AI</span>
              <span className="text-[10px] text-zinc-500">Provide an idea to generate requirements in The Wiki</span>
            </button>
            
            <button className="w-full text-left p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/40 transition group flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-400 transition">Extract Board Tickets</span>
              <span className="text-[10px] text-zinc-500">Convert Wiki specifications into tasks on The Board</span>
            </button>
            
            <button className="w-full text-left p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/40 transition group flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400 transition">Generate Test Scenarios</span>
              <span className="text-[10px] text-zinc-500">Auto-create test scenarios in The Laboratory from tasks</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
