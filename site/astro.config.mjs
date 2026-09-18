// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://jane-skills.vercel.app",
  integrations: [
    starlight({
      title: "ship-ready-web",
      description: "Audit and harden AI-built websites before they ship.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/CarlsonKamau/jane-skills" }],
      lastUpdated: true,
      sidebar: [
        { label: "Start here", items: ["01-why", "02-quickstart-beginner", "03-step-by-step"] },
        { label: "Reference", items: ["04-checklist-explained", "05-compliance-guide", "06-nextjs-adapter"] },
        { label: "Deeper", items: ["07-expert-notes", "08-case-study"] },
        { label: "Help", items: ["09-glossary", "10-faq"] },
      ],
      customCss: ["./src/styles/custom.css"],
      head: [
        { tag: "meta", attrs: { property: "og:image", content: "/og.svg" } },
      ],
    }),
  ],
});
