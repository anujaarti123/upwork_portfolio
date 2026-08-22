"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/cms";
import { useAdminStore } from "@/stores/admin-store";
import type { SiteData } from "@/types/cms";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroEditor } from "./hero-editor";
import { SectionManager } from "./section-manager";
import { ProjectsManager } from "./projects-manager";
import { CaseStudiesManager } from "./case-studies-manager";
import { FooterEditor } from "./footer-editor";
import { AboutEditor } from "./about-editor";

interface AdminDashboardProps {
  initialData: SiteData;
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const { data, setData, isSaving, toast, clearToast } = useAdminStore();

  useEffect(() => {
    setData(initialData);
  }, [initialData, setData]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(clearToast, 3000);
      return () => clearTimeout(t);
    }
  }, [toast, clearToast]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-[var(--primary-accent)]" />
            <h1 className="text-lg font-bold">CMS Control Panel</h1>
            {isSaving && (
              <span className="text-xs text-[var(--primary-accent)] animate-pulse">Saving...</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" size="sm">
              <Link href="/" target="_blank">
                <ExternalLink className="h-4 w-4" /> View Site
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 rounded-lg px-4 py-3 text-sm shadow-xl ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-[var(--secondary-accent)] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="hero">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="hero">Hero Editor</TabsTrigger>
            <TabsTrigger value="about">About & Intro Editor</TabsTrigger>
            <TabsTrigger value="styling">Section & Styling</TabsTrigger>
            <TabsTrigger value="projects">Portfolio CMS</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="footer">Footer & Socials</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroEditor />
          </TabsContent>
          <TabsContent value="about">
            <AboutEditor />
          </TabsContent>
          <TabsContent value="styling">
            <SectionManager />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          <TabsContent value="case-studies">
            <CaseStudiesManager />
          </TabsContent>
          <TabsContent value="footer">
            <FooterEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
