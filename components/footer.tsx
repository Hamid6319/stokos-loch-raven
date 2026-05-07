import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-green-800 text-white dark:bg-black">
      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 md:py-14">
        
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4 md:items-start">
          
          {/* Brand */}
          <div className="pt-1 md:pt-[-2px]">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/newstokoslogo.png"
                alt="Stoko's Logo"
                width={170}
                height={70}
                priority
                className="h-12 w-auto object-contain md:h-[58px]"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">
              Fresh pizza, subs, wings, platters, and local favorites made for fast pickup and delivery.
            </p>

            <Link
              href="/store/towson"
              className="mt-6 inline-flex rounded-full bg-[#DA3327] px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-[#c52d22]"
            >
              Start Order
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-3">
            <h3 className="text-2xl font-black uppercase tracking-wide">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/store/towson#trending" className="hover:text-white">Menu</Link></li>
              <li><Link href="/store/towson#deals" className="hover:text-white">Deals</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div className="pt-3">
            <h3 className="text-2xl font-black uppercase tracking-wide">
              Locations
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><Link href="/store/towson" className="hover:text-white">Towson Store</Link></li>
              <li><Link href="/store/york" className="hover:text-white">York Store</Link></li>
              <li><Link href="/store/liberty" className="hover:text-white">Liberty Store</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="pt-3">
            <h3 className="text-2xl font-black uppercase tracking-wide">
              Contact
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-white/75">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-white" />
                <span>Choose your nearest Stoko&apos;s location.</span>
              </li>

              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-white" />
                <span>Call your local store</span>
              </li>

              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-white" />
                <span>support@stokos.com</span>
              </li>

              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-white" />
                <span>Open daily for pickup and delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Stoko&apos;s. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}