import { useState } from 'react';
import { Link } from 'react-router-dom'
import arrowRight from '../assets/arrow-right.png'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm rounded-sm m-2 sm:m-4 md:m-6 h-auto">
      <div className="max-w-10xl mx-auto flex flex-wrap items-center justify-between py-3 px-3 sm:py-4 sm:px-6 md:py-6 md:px-8">
        <nav className="flex-1">
          {/* Hamburger for mobile */}
          <div className="sm:hidden flex items-center justify-between">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 focus:outline-none">
              <span className="block w-6 h-0.5 bg-gray-900 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-900 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-900"></span>
            </button>
          </div>
          {/* Nav links */}
          <ul className={`sm:flex space-x-0 sm:space-x-6 md:space-x-8 text-base font-normal text-gray-900 ${menuOpen ? 'block' : 'hidden'} sm:flex flex-col sm:flex-row mt-2 sm:mt-0`}> 
            <li><Link to="/about" className="block py-2 px-2 hover:text-gray-600 transition">About</Link></li>
            <li><Link to="/news" className="block py-2 px-2 hover:text-gray-600 transition">News</Link></li>
            <li><Link to="/services" className="block py-2 px-2 hover:text-gray-600 transition">Services</Link></li>
            <li><Link to="/team" className="block py-2 px-2 hover:text-gray-600 transition">Our Team</Link></li>
            <li><Link to="/enquiry" className="block py-2 px-2 hover:text-gray-600 transition">Make Enquiry</Link></li>
          </ul>
        </nav>
        <Link to="/contact" className="flex items-center border border-gray-900 rounded px-4 py-2 sm:px-6 sm:py-2 font-normal text-gray-900 hover:bg-gray-100 transition mt-2 sm:mt-0 text-sm sm:text-base">
          Contact us
          <img src={arrowRight} alt="arrow right" className="ml-2 w-5 h-5 object-contain" />
        </Link>
      </div>
    </header>
  )
} 