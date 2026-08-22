import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { DynamicFavicon } from "@/components/layout/dynamic-favicon";
import { HeroSectionView } from "@/components/sections/hero-section";
import { EcosystemSection } from "@/components/sections/ecosystem-section";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { FooterSection } from "@/components/sections/footer-section";
import { getSiteData, REVALIDATE_SECONDS } from "@/lib/data/site";
import { DEFAULT_SITE_DATA } from "@/lib/data/defaults";

export const revalidate = REVALIDATE_SECONDS;

export default async function HomePage() {
  const siteData = (await getSiteData()) ?? DEFAULT_SITE_DATA;
  const { settings, hero, metrics, projects, caseStudies, techTags, footer, socialLinks } =
    siteData;

  return (
    <ThemeProvider settings={settings}>
      <DynamicFavicon url={settings.favicon_url} />
      <Navbar settings={settings} />
      <main>
        {settings.show_hero && (
          <HeroSectionView hero={hero} metrics={metrics} settings={settings} />
        )}
        {settings.show_ecosystem && (
          <EcosystemSection projects={projects} labels={settings.section_labels} />
        )}
        {settings.show_case_studies && (
          <CaseStudiesSection caseStudies={caseStudies} labels={settings.section_labels} />
        )}
        {settings.show_tech_stack && (
          <TechStackSection tags={techTags} labels={settings.section_labels} />
        )}
        {settings.show_footer && (
          <FooterSection footer={footer} socialLinks={socialLinks} />
        )}
      </main>
    </ThemeProvider>
  );
}
