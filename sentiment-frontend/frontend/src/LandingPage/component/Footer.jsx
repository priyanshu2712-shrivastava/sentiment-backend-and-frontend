import React from 'react';
import { Facebook, Instagram, X } from 'lucide-react';
import Footer_Card from '../../utils/Footer_Card';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-neutral-500">
      {/* Top border */}
      <div className="border-t border-black"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32">
          {/* Left Section */}
          <div className="flex flex-col justify-between">
            <h2 className="text-5xl font-normal tracking-wide">XSentiment</h2>
            <h3 className="text-5xl font-light mt-32">Stay Connected</h3>
          </div>

          {/* Right Section */}
          <div className="flex justify-between gap-16">
            {/* Contact Info */}
            <div className="flex flex-col">
              <p className="text-sm mb-1">123-456-7890</p>
              <p className="text-sm mb-8">info@mysite.com</p>
              
              <address className="not-italic text-sm leading-relaxed mb-8">
                500 Mahatama Gandhi Road,<br />
                6th Floor,Kolkata,<br />
                WB 700056
              </address>
              
        <Footer_Card/>
            </div>

            {/* Links */}
            <div className="flex flex-col">
              <a href="#" className="text-sm mb-2 hover:opacity-70">Privacy Policy</a>
              <a href="#" className="text-sm mb-2 underline hover:opacity-70">Accessibility Statement</a>
              <a href="#" className="text-sm mb-2 hover:opacity-70">Shipping Policy</a>
              <a href="#" className="text-sm mb-2 underline hover:opacity-70">Terms & Conditions</a>
              <a href="#" className="text-sm underline hover:opacity-70">Refund Policy</a>
            </div>
          </div>
        </div>

        {/* Bottom border and copyright */}
        <div className="border-t border-black mt-16 pt-8">
          <p className="text-xs text-right">
            © 2025 by XSentiment. 
          </p>
        </div>
      </div>
    </footer>
  );
}