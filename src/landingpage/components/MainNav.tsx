import * as React from "react"
import { cn } from "../../lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../../components/ui/navigation-menu"
import { PlaneIcon as PaperPlaneIcon } from "lucide-react"
import { Button } from "../../components/ui/button"

export function MainNav() {
  return (
    <div className="flex justify-between items-center w-full">
      <a href="/" className="flex items-center gap-2">
        <PaperPlaneIcon className="h-6 w-6 rotate-[-15deg] animate-pulse" />
        <span className="text-xl font-medium">Questnote</span>
      </a>

      {/* <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-50 to-gray-100 p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">Questnote</div>
                      <p className="text-sm leading-tight text-gray-600">
                        Pioneering AI Infrastructure, Built for Education
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="#" title="AI Learning">
                  Personalized learning experiences powered by AI
                </ListItem>
                <ListItem href="#" title="Smart Content">
                  Intelligent content creation and curation
                </ListItem>
                <ListItem href="#" title="Analytics">
                  Data-driven insights for educational outcomes
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="#" className={navigationMenuTriggerStyle()}>
              Pricing
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="#" className={navigationMenuTriggerStyle()}>
              About
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}

      <div className="flex items-center gap-4">
        {/* <Button variant="outline" className="hidden md:inline-flex">
          Sign In
        </Button> */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-500">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
