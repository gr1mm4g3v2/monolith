"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getActiveProjectId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("active_project_id")?.value || null;
}

export async function setActiveProject(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set("active_project_id", projectId, { 
    path: "/", 
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });
  revalidatePath("/");
}

export async function createProject(name: string, description?: string) {
  const project = await prisma.project.create({
    data: {
      name,
      description,
    },
  });
  
  await setActiveProject(project.id);
  return project;
}
