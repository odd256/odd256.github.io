import { siteConfig } from "@/config/site";
import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-20 py-12 border-t border-border/40">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="font-medium text-foreground">
            © 2024-{currentYear} {siteConfig.title}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/archive" className="hover:text-primary transition-colors">
            归档
          </Link>
          <span className="text-border">|</span>
          <p>
            Powered by{" "}
            <a 
              href="https://github.com/odd256/EasyShare" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              EasyShare
            </a>
          </p>
          <span className="text-border">|</span>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500 animate-pulse text-[10px]">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
