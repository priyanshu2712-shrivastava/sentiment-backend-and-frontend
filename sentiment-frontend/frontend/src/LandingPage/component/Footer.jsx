// components/Footer.jsx
import React from 'react';
// Assuming Footer_Card is another component (placeholder)
const Footer_Card = () => (
    <div className="w-full mt-4 p-4 bg-purple-100 dark:bg-purple-900/50 rounded-md 
                    text-sm text-neutral-800 dark:text-neutral-200">
        Subscribe to our newsletter for updates!
    </div>
);

export default function Footer() {
    return (
        <footer id='contact' className="bg-gray-100 dark:bg-black text-black dark:text-neutral-400 transition-colors duration-500">
            {/* Top border */}
            <div className="border-t border-gray-300 dark:border-neutral-700"></div>
            
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                    {/* Left Section */}
                    <div className="flex flex-col justify-between">
                        <h2 className="text-5xl font-normal tracking-wide text-gray-900 dark:text-white">XSentiment</h2>
                        <h3 className="text-4xl font-light mt-16 md:mt-32 text-gray-700 dark:text-neutral-300">Stay Connected</h3>
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
                            <a href="#" className="text-sm mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm mb-2 hover:text-purple-600 dark:hover:text-purple-400 underline transition-colors">Accessibility Statement</a>
                            <a href="#" className="text-sm mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Shipping Policy</a>
                            <a href="#" className="text-sm mb-2 hover:text-purple-600 dark:hover:text-purple-400 underline transition-colors">Terms & Conditions</a>
                            <a href="#" className="text-sm hover:text-purple-600 dark:hover:text-purple-400 underline transition-colors">Refund Policy</a>
                        </div>
                    </div>
                </div>

                {/* Bottom border and copyright */}
                <div className="border-t border-gray-300 dark:border-neutral-700 mt-16 pt-8">
                    <p className="text-xs text-center md:text-right">
                        © 2025 by XSentiment. All rights reserved. 
                    </p>
                </div>
            </div>
        </footer>
    );
}