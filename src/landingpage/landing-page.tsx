import { Button } from "../components/ui/button"
import {
  AtomIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  GraduationCapIcon,
  PlaneIcon as PaperPlaneIcon,
  SparklesIcon,
} from "lucide-react"
import { MainNav } from "./components/MainNav"
import { NewsletterForm } from "./components/newsletter-form"
import { AnimatedIcon } from "./components/AnimatedIcons"
import { ThemeProvider } from "./components/theme-provider"

export default function LandingPage() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="questnote-theme">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto py-6 px-4">
          <MainNav />
        </header>

        {/* Hero Section */}
        <main className="relative flex-2 container mx-auto px-4 py-16 md:py-24 overflow-hidden">
          
          {/* Animated Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <AnimatedIcon
              icon={<PaperPlaneIcon className="h-16 w-16 rotate-[30deg] animate-bounce text-gray-400" />}
              className="absolute top-10 right-10 md:right-40 opacity-10"
              delay={300}
            />
            <AnimatedIcon
              icon={<AtomIcon className="h-12 w-12 animate-spin text-gray-400" />}
              className="absolute bottom-20 left-10 md:left-40 opacity-10"
              delay={600}
            />
            <AnimatedIcon
              icon={<BrainCircuitIcon className="h-14 w-14 animate-pulse text-gray-400" />}
              className="absolute top-40 left-20 opacity-10"
              delay={900}
            />
            <AnimatedIcon
              icon={<GraduationCapIcon className="h-14 w-14 text-gray-400" />}
              className="absolute bottom-40 right-20 opacity-10"
              delay={1200}
            />
            <AnimatedIcon
              icon={<BookOpenIcon className="h-10 w-10 text-gray-400" />}
              className="absolute top-1/2 right-1/4 opacity-10"
              delay={1500}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              The Future of Learning is Here
            </h1>
            <p className="text-base sm:text-1xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Pioneering AI Infrastructure, Built for Education. Revolutionizing how we learn, teach, and grow.
            </p>

            {/* Newsletter Signup */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Be the First to Know</h3>
              <p className="text-gray-600 mb-6">Join our waitlist to get early access when we launch.</p>
              <NewsletterForm />
            </div>
          </div>

        </main>
      </div>
    </ThemeProvider>
  )
}

// import { Button } from "../components/ui/button"
// import {
//   AtomIcon,
//   BookOpenIcon,
//   BrainCircuitIcon,
//   GraduationCapIcon,
//   PlaneIcon as PaperPlaneIcon,
//   SparklesIcon,
//   RocketIcon,
//   LightbulbIcon,
// } from "lucide-react"
// import { MainNav } from "./components/MainNav"
// import { NewsletterForm } from "./components/newsletter-form"
// import { AnimatedIcon } from "./components/AnimatedIcons"
// import { ThemeProvider } from "./components/theme-provider"

// function LandingPage() {
//   return (
//     <ThemeProvider defaultTheme="light" storageKey="questnote-theme">
//       <div className="flex flex-col min-h-screen">
//         {/* Header */}
//         <header className="container mx-auto py-6 px-4">
//           <MainNav />
//         </header>

//         {/* Hero Section */}
//         <main className="flex-2 container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
//           {/* Animated Decorative Elements */}
//           <AnimatedIcon
//             icon={<PaperPlaneIcon className="h-16 w-16 rotate-[30deg] animate-bounce" />}
//             className="absolute top-10 right-10 md:right-40 opacity-10"
//             delay={300}
//           />
//           <AnimatedIcon
//             icon={<AtomIcon className="h-12 w-12 animate-spin" />}
//             className="absolute bottom-20 left-10 md:left-40 opacity-10"
//             delay={600}
//           />
//           <AnimatedIcon
//             icon={<BrainCircuitIcon className="h-14 w-14 animate-pulse" />}
//             className="absolute top-40 left-20 opacity-10"
//             delay={900}
//           />
//           <AnimatedIcon
//             icon={<GraduationCapIcon className="h-14 w-14" />}
//             className="absolute bottom-40 right-20 opacity-10"
//             delay={1200}
//           />
//           <AnimatedIcon
//             icon={<BookOpenIcon className="h-10 w-10" />}
//             className="absolute top-1/2 right-1/4 opacity-10"
//             delay={1500}
//           />

//           {/* Hero Content */}
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-4xl md:text-4xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
//               The Future of Learning is Here
//             </h1>
//             <p className="text-xl md:text-1xl text-gray-600 mb-10 max-w-2xl mx-auto">
//               Pioneering AI Infrastructure, Built for Education. Revolutionizing how we learn, teach, and grow in the
//               digital age.
//             </p>
//             {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//               <Button className="px-8 py-6 text-lg group">
//                 <span>Coming Soon</span>
//                 <SparklesIcon className="ml-2 h-5 w-5 transition-all group-hover:rotate-12" />
//               </Button>
//             </div> */}

//             {/* Newsletter Signup */}
//             <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
//               <h3 className="text-xl font-semibold mb-4">Be the First to Know</h3>
//               <p className="text-gray-600 mb-6">Join our waitlist to get early access when we launch.</p>
//               <NewsletterForm />
//             </div>
//           </div>
//         </main>

//         {/* Features Section */}
//         {/* <section className="container mx-auto px-4 py-16 md:py-24">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">Redefining Educational Technology</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Our platform combines cutting-edge AI with intuitive design to create powerful learning experiences.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
//               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                 <BrainCircuitIcon className="h-6 w-6 text-gray-700" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">AI-Powered Learning</h3>
//               <p className="text-gray-600">
//                 Adaptive learning paths that evolve with each student's progress and learning style.
//               </p>
//             </div>
//             <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
//               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                 <RocketIcon className="h-6 w-6 text-gray-700" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">Smart Content</h3>
//               <p className="text-gray-600">
//                 Dynamic content generation that adapts to educational objectives and student needs.
//               </p>
//             </div>
//             <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
//               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                 <LightbulbIcon className="h-6 w-6 text-gray-700" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">Educational Insights</h3>
//               <p className="text-gray-600">
//                 Comprehensive analytics that provide actionable insights for improved learning outcomes.
//               </p>
//             </div>
//           </div>
//         </section> */}

//         {/* Footer */}
//         {/* <footer className="border-t border-gray-100 py-12 mt-12">
//           <div className="container mx-auto px-4">
//             <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//               <div className="flex items-center gap-2 mb-4 md:mb-0">
//                 <PaperPlaneIcon className="h-5 w-5 rotate-[-15deg]" />
//                 <span className="text-lg font-medium">Questnote</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
//                   <span>All systems operational</span>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               <div>
//                 <h4 className="font-medium mb-4">Product</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Features
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Pricing
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Roadmap
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-4">Company</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       About
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Careers
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Contact
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-4">Resources</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Blog
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Documentation
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Help Center
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-4">Legal</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Privacy
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Terms
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
//                       Cookies
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500 text-center">
//               © {new Date().getFullYear()} Questnote. All rights reserved.
//             </div>
//           </div>
//         </footer> */}
//       </div>
//     </ThemeProvider>
//   )
// }

// export default LandingPage;
