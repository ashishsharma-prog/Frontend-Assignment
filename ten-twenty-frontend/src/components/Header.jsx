import { Link } from 'react-router-dom'
import arrowRight from '../assets/arrow-right.png'

export default function Header() {
  return (
    <header className="bg-white shadow-sm rounded-sm m-6 h-[101px]">
      <div className="max-w-10xl mx-auto flex items-center justify-between py-6 px-8">
        <nav className="flex justify-start">
          <ul className="flex space-x-8 text-base font-normal text-gray-900">
            <li><Link to="/about" className="hover:text-gray-600 transition">About</Link></li>
            <li><Link to="/news" className="hover:text-gray-600 transition">News</Link></li>
            <li><Link to="/services" className="hover:text-gray-600 transition">Services</Link></li>
            <li><Link to="/team" className="hover:text-gray-600 transition">Our Team</Link></li>
            <li><Link to="/enquiry" className="hover:text-gray-600 transition">Make Enquiry</Link></li>
          </ul>
        </nav>
        <Link to="/contact" className="flex items-center border border-gray-900 rounded px-6 py-2 font-normal text-gray-900 hover:bg-gray-100 transition">
          Contact us
          <img src={arrowRight} alt="arrow right" className="ml-2 w-5 h-5 object-contain" />
        </Link>
      </div>
    </header>
  )
} 