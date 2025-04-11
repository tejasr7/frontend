
export function Footer() {
  return (
    <footer className="w-full py-6 md:py-12 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">About</a></li>
              <li><a href="#features" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Careers</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Guides</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Support</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Terms</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Privacy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Cookies</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">Licenses</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#contact" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary">contact@company.com</a></li>
              <li><span className="text-gray-500 dark:text-gray-400">+1 (555) 123-4567</span></li>
              <li><span className="text-gray-500 dark:text-gray-400">123 Business Ave, Suite 100<br />San Francisco, CA 94107</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Company Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
