
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Simple, transparent pricing
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the perfect plan for your business needs
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 lg:grid-cols-3">
          {/* Starter Plan */}
          <div className="flex flex-col rounded-lg border bg-background shadow-sm transition-all hover:shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$29</span>
                <span className="ml-1 text-sm text-gray-500">/ month</span>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Perfect for small businesses just getting started.
              </p>
              <Button className="mt-6 w-full">Get Started</Button>
            </div>
            <div className="flex flex-col space-y-2 border-t p-6">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>5 team members</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>10GB storage</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Basic analytics</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Email support</span>
              </div>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="flex flex-col rounded-lg border bg-primary text-primary-foreground shadow-sm transition-all hover:shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$79</span>
                <span className="ml-1 text-sm opacity-80">/ month</span>
              </div>
              <p className="mt-4 opacity-90">
                For growing businesses that need more.
              </p>
              <Button variant="secondary" className="mt-6 w-full">Get Started</Button>
            </div>
            <div className="flex flex-col space-y-2 border-t border-primary/20 p-6">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>20 team members</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>50GB storage</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Custom integrations</span>
              </div>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div className="flex flex-col rounded-lg border bg-background shadow-sm transition-all hover:shadow-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$199</span>
                <span className="ml-1 text-sm text-gray-500">/ month</span>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                For large organizations with advanced needs.
              </p>
              <Button className="mt-6 w-full">Get Started</Button>
            </div>
            <div className="flex flex-col space-y-2 border-t p-6">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Unlimited team members</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>500GB storage</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Custom reporting</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>24/7 dedicated support</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Advanced security features</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
