import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";

const stores = [
  {
    name: "Towson",
    slug: "towson",
    address: "6821 Loch Raven Blvd,\nLoch Raven, MD 21286",
    phone: "410-296-6066",
    hours: "Daily: 11am - 11:30pm",
    facebook:
      "https://www.facebook.com/people/Stokos-Towson/100066667372039/",
    yelp: "https://www.yelp.com/biz/stokos-towson",
    google: "https://share.google/mFcJdRzLeeEuM8D2o",
  },
  {
    name: "Baltimore - York",
    slug: "york",
    address: "5503 York Rd,\nBaltimore, MD 21212",
    phone: "410-433-4161",
    hours: "Daily: 11am - 12am",
    facebook: "https://www.facebook.com/people/Stokos/100066313219435/",
    yelp: "https://www.yelp.com/biz/stokos-baltimore",
    google: "https://share.google/auEBQDz2qngc08fkJ",
  },
  {
    name: "Liberty",
    slug: "liberty",
    address: "8624 Liberty Rd\nRandallstown, MD 21133",
    phone: "410-655-0009",
    hours: "Sun - Thu: 10am - 10pm\nFri - Sat: 10am - 11pm",
    facebook: "",
    yelp: "",
    google: "https://share.google/8X2nSgI5Oi6Y73Wnk",
  },
];

export default function MainFooter() {
  return (
    <footer
      id="contact"
      className="w-full bg-green-800 text-white transition-colors duration-300 dark:bg-[#003b11]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr]">
          {/* Brand */}
          <div className="flex flex-col ">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/newstokoslogo.png"
                alt="Stoko's Logo"
                width={180}
                height={70}
                priority
                className="h-12 w-auto object-contain md:h-[58px]"
              />
            </Link>

            <p className="mt-6 max-w-sm text-sm font-medium leading-7 text-white/75">
              Fresh pizza, wings, subs, salads, and local favorites from your
              nearest Stoko’s location.
            </p>

        
          </div>

          {/* Stores */}
          <div className="grid gap-8 md:grid-cols-3">
            {stores.map((store, index) => (
              <div
                key={store.slug}
                className={`md:px-8 ${
                  index !== 0 ? "md:border-l md:border-white/20" : ""
                }`}
              >
                <h3 className="text-xl font-black uppercase tracking-wide text-white">
                  {store.name}
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3 text-sm font-medium leading-6 text-white/75">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-white" />
                    <p className="whitespace-pre-line">{store.address}</p>
                  </div>

                  <div className="flex items-start gap-3 text-sm font-medium leading-6 text-white/75">
                    <Clock size={18} className="mt-0.5 shrink-0 text-white" />
                    <p className="whitespace-pre-line">{store.hours}</p>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-black text-white">
                    <Phone size={18} className="shrink-0 text-white" />
                    <a
                      href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
                      className="transition hover:text-white/75"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="mt-7 flex items-center gap-3">
                  {store.facebook && (
                    <a
                      href={store.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${store.name} Facebook`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-blue-700 transition hover:scale-105"
                    >
                      f
                    </a>
                  )}

                  {store.yelp && (
                    <a
                      href={store.yelp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${store.name} Yelp`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-red-600 transition hover:scale-105"
                    >
                      Yelp
                    </a>
                  )}

                  <a
                    href={store.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${store.name} Google`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-green-700 transition hover:scale-105"
                  >
                    G
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-7 text-sm font-medium text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Stoko&apos;s. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <a href="#stores" className="transition hover:text-white">
              Stores
            </a>

            <a href="#testimonials" className="transition hover:text-white">
              Testimonials
            </a>

            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>

            {/* <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>

            <Link href="#" className="transition hover:text-white">
              Terms
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}