"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

type StoreLocation = {
  name: string;
  slug: string;
  addressLine: string;
  phone: string;
  hoursLabel: string;
  schedule: {
    days: number[];
    open: string;
    close: string;
  }[];
};

const STORES: StoreLocation[] = [
  {
    name: "Towson",
    slug: "towson",
    addressLine: "6821 Loch Raven Blvd, Towson, MD 21286",
    phone: "410-296-6066",
    hoursLabel: "Daily: 11am - 11:30pm",
    schedule: [{ days: [0, 1, 2, 3, 4, 5, 6], open: "11:00", close: "23:30" }],
  },
  {
    name: "York",
    slug: "york",
    addressLine: "5403 York Rd, Baltimore, MD 21212",
    phone: "410-433-4161",
    hoursLabel: "Daily: 11am - 12am",
    schedule: [{ days: [0, 1, 2, 3, 4, 5, 6], open: "11:00", close: "24:00" }],
  },
  {
    name: "Liberty",
    slug: "liberty",
    addressLine: "6700 Liberty Rd, Baltimore, MD 21207",
    phone: "410-655-0009",
    hoursLabel: "Sun - Thu: 10am - 10pm\nFri - Sat: 10am - 11pm",
    schedule: [
      { days: [0, 1, 2, 3, 4], open: "10:00", close: "22:00" },
      { days: [5, 6], open: "10:00", close: "23:00" },
    ],
  },
];

export default function LocationStoreCards() {
  const searchParams = useSearchParams();

  const action = searchParams.get("action");
  const category = searchParams.get("category");
  const deal = searchParams.get("deal");

  const hasSelection = Boolean(action || category || deal);

const buildStoreHref = (slug: string) => {
  const params = new URLSearchParams();

  if (deal) params.set("deal", deal);
  if (category) params.set("category", category);
  if (action) params.set("action", action);

  const query = params.toString();

  if (category) {
    return query
      ? `/store/${slug}?${query}#${category}`
      : `/store/${slug}#${category}`;
  }

  if (deal) {
    return query
      ? `/store/${slug}?${query}#deals`
      : `/store/${slug}#deals`;
  }

  return query ? `/store/${slug}?${query}` : `/store/${slug}`;
};

  return (
    <section className="w-full px-4 py-16 text-black transition-colors duration-300 dark:bg-[#07110a] dark:text-white md:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1280px]">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-[13px] font-black uppercase tracking-wide text-black shadow-sm transition hover:bg-[#DA3327] hover:text-white dark:border-white/10 dark:bg-[#121b13] dark:text-white dark:hover:bg-[#DA3327]"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Back to Home
        </Link>

        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[12px] font-black uppercase tracking-[0.35em] text-[#ff3131]">
              Choose Your Store
            </p>

            <h1 className="text-[38px] font-black leading-tight tracking-[-0.05em] text-black dark:text-white md:text-[52px]">
              Select a Stoko’s location
            </h1>

            <p className="mt-4 max-w-[620px] text-[16px] font-medium leading-[1.7] text-black/65 dark:text-white/65 md:text-[18px]">
              Pick your nearest location to continue ordering online.
            </p>
          </div>

          {hasSelection && (
            <div>
            

            
            </div>
          )}
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {STORES.map((store) => {
            const openNow = isStoreOpen(store.schedule);

            return (
              <article
                key={store.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(0,0,0,0.13)] dark:border-white/10 dark:bg-[#121b13] dark:shadow-[0_16px_45px_rgba(0,0,0,0.35)]"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#DA3327]/10 text-[#DA3327] sm:flex">
                      <Store size={20} strokeWidth={2.5} />
                    </div>

                    <h2 className="text-[26px] font-black tracking-[-0.04em] text-black dark:text-white">
                      {store.name}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-black uppercase ${
                      openNow
                        ? "bg-green-100 text-[#138A3D] dark:bg-green-500/15 dark:text-green-300"
                        : "bg-[#DA3327] text-white"
                    }`}
                  >
                    {openNow ? "Open Now" : "Closed"}
                  </span>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex min-w-0 items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <MapPin size={18} className="shrink-0 text-[#DA3327]" />
                    <p className="min-w-0 truncate whitespace-nowrap text-[14px] font-medium leading-none md:text-[15px]">
                      {store.addressLine}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <Phone size={17} className="shrink-0 text-[#DA3327]" />
                    <a
                      href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
                      className="text-[14px] font-medium leading-none transition hover:text-[#DA3327] md:text-[15px]"
                    >
                      {store.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                    <Clock
                      size={17}
                      className="mt-[2px] shrink-0 text-[#DA3327]"
                    />

                    <div className="space-y-2 text-[14px] font-medium leading-none md:text-[15px]">
                      {store.hoursLabel.split("\n").map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={buildStoreHref(store.slug)}
                  className="mt-auto inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#DA3327] px-6 py-4 text-sm font-black uppercase text-white shadow-[0_12px_28px_rgba(218,51,39,0.25)] transition hover:bg-[#12863d] group-hover:shadow-lg group-hover:shadow-green-900/20"
                >
                  Continue to Store
                  <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function isStoreOpen(schedule: StoreLocation["schedule"]) {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hourValue = parts.find((part) => part.type === "hour")?.value;
  const minuteValue = parts.find((part) => part.type === "minute")?.value;

  if (!weekday || !hourValue || !minuteValue) return false;

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const currentDay = dayMap[weekday];
  let currentHour = Number(hourValue);

  if (currentHour === 24) currentHour = 0;

  const currentMinutes = currentHour * 60 + Number(minuteValue);
  const todaySchedule = schedule.find((item) => item.days.includes(currentDay));

  if (!todaySchedule) return false;

  const openMinutes = timeToMinutes(todaySchedule.open);
  const closeMinutes = timeToMinutes(todaySchedule.close);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}