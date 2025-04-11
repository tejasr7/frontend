
import { 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Shield 
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary dark:bg-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to succeed
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform provides all the tools you need to take your business to the next level.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Reliability</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Our platform ensures 99.9% uptime for your critical business operations.
            </p>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Speed</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Lightning-fast performance that keeps your business running efficiently.
            </p>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Analytics</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Comprehensive insights to make informed decisions for your business.
            </p>
          </div>
          <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Security</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Enterprise-grade security to protect your valuable data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
