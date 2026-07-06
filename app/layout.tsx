import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import ProjectSelector from "@/components/ProjectSelector";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Monolith — AI-Native Solo Dev Suite",
  description: "Unified AI-driven workspace combining The Wiki, The Canvas, The Board, and The Laboratory.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Query projects and active project cookie on the server
  let projects: any[] = [];
  let activeProjectId: string | null = null;
  let showOnboarding = true;

  try {
    projects = await prisma.project.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      }
    });

    const cookieStore = await cookies();
    activeProjectId = cookieStore.get("active_project_id")?.value || null;

    if (projects.length > 0) {
      showOnboarding = false;
      const activeProjectExists = projects.some((p) => p.id === activeProjectId);
      if (!activeProjectId || !activeProjectExists) {
        activeProjectId = projects[0].id;
      }
    }
  } catch (error) {
    console.error("Layout projects fetch failed:", error);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-background text-foreground overflow-hidden">
        <Sidebar 
          projectSelector={
            !showOnboarding ? (
              <ProjectSelector projects={projects} activeProjectId={activeProjectId} />
            ) : undefined
          } 
        />
        <div className="flex flex-col flex-1 h-screen overflow-y-auto relative">
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
        
        {showOnboarding && <OnboardingOverlay />}
      </body>
    </html>
  );
}
