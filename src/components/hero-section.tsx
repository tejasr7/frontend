
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 hero-pattern">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                The Ultimate Platform for Your Business
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Empower your business with our cutting-edge solutions. Streamline workflows, boost productivity, and drive growth.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="inline-flex h-10 items-center justify-center rounded-md border border-input px-8">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-muted p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                className="h-full w-full text-muted-foreground/30"
              >
                <path d="M16 2 L16 30 M2 16 L30 16 M2 2 L30 30 M30 2 L2 30" />
                <circle cx="16" cy="16" r="12" />
                <circle cx="16" cy="16" r="4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
