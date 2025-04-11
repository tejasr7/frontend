
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="hidden font-bold sm:inline-block">
              Company
            </span>
          </a>
        </div>
        
        <div className="hidden md:flex md:items-center md:gap-6">
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm">Sign up</Button>
          </div>
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-1">
            <a
              href="#features"
              className="block py-2 px-3 text-base hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block py-2 px-3 text-base hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block py-2 px-3 text-base hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              About
            </a>
            <a
              href="#contact"
              className="block py-2 px-3 text-base hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Contact
            </a>
            <div className="pt-4">
              <Button className="w-full">Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
