import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import type { Store } from "@/lib/data/stores";
import { STORES } from "@/lib/data/stores";

type FooterProps = {
  store: Store;
};

export default function Footer({ store }: FooterProps) {
  return (
    <footer className="w-full bg-green-800 text-white dark:bg-black">
      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-4 md:items-start">
          
          {/* Brand */}
          <div className="pt-1">
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
              href={store.menuUrl}
              className="mt-6 inline-flex rounded-full bg-[#DA3327] px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-[#c52d22]"
            >
              Start Order
            </Link>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              {store.social.facebook && (
                <a
                  href={store.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-blue-700 transition hover:scale-105"
                >
                  f
                </a>
              )}

              {store.social.yelp && (
                <a
                  href={store.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-red-600 transition hover:scale-105"
                >
                  Yelp
                </a>
              )}

              {store.social.google && (
                <a
                  href={store.social.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-green-700 transition hover:scale-105"
                >
                  G
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-3">
            <h3 className="text-2xl font-black uppercase tracking-wide">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link href={`${store.menuUrl}#trending`} className="hover:text-white">Menu</Link>
              </li>
              <li>
                <Link href={`${store.menuUrl}#deals`} className="hover:text-white">Deals</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="pt-3">
            <h3 className="text-2xl font-black uppercase tracking-wide">
              Locations
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/75">
              {STORES.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.menuUrl}
                    className={`hover:text-white ${
                      item.slug === store.slug ? "font-black text-white" : ""
                    }`}
                  >
                    {item.displayName} Store
                  </Link>
                </li>
              ))}
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
                <span>
                  {store.address}
                  <br />
                  {store.cityStateZip}
                </span>
              </li>

              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-white" />
                <a href={`tel:${store.phone}`} className="hover:text-white">
                  {store.phone}
                </a>
              </li>

              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-white" />
                <a href={`mailto:${store.email}`} className="hover:text-white">
                  {store.email}
                </a>
              </li>

              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-white" />
                <span>
                  {store.hours.map((hour) => (
                    <span key={hour} className="block">
                      {hour}
                    </span>
                  ))}
                </span>
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