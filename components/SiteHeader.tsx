import { siteConfig } from "@/config/site";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { getIndexContent } from "@/lib/notes";
import { Blur } from "./animate-ui/primitives/effects/blur";
import { siGithub, siX, siGmail } from "simple-icons";
import { Button } from "./ui/button";
import { SimpleIcon } from "./SimpleIcon";

export function SiteHeader() {
  const indexData = getIndexContent();
  
  return (
    <header className="mb-16">
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Blur asChild>
            <h1 className="text-5xl font-extrabold tracking-tighter">
              {siteConfig.title || indexData?.metadata.title || "My Notes"}
            </h1>
          </Blur>
        </Link>
        <div className="flex items-center gap-2">
          {siteConfig.links.github && (
            <Button variant="ghost" size="icon" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <SimpleIcon path={siGithub.path} className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}
          {siteConfig.links.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                <SimpleIcon path={siX.path} className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
          )}
          {siteConfig.links.email && (
            <Button variant="ghost" size="icon" asChild>
              <a href={`mailto:${siteConfig.links.email}`}>
                <SimpleIcon path={siGmail.path} className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
