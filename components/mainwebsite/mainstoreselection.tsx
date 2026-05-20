"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

type Store = {
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

const STORES: Store[] = [
  {
    name: "Towson",
    slug: "towson",
    addressLine: "6821 Loch Raven Blvd, Towson, MD 21286",
    phone: "410-296-6066",
    hoursLabel: "Daily: 11am - 11:30pm",
    schedule: [
      {
        days: [0, 1, 2, 3, 4, 5, 6],
        open: "11:00",
        close: "23:30",
      },
    ],
  },
  {
    name: "York",
    slug: "york",
    addressLine: "5403 York Rd, Baltimore, MD 21212",
    phone: "410-433-4161",
    hoursLabel: "Daily: 11am - 12am",
    schedule: [
      {
        days: [0, 1, 2, 3, 4, 5, 6],
        open: "11:00",
        close: "24:00",
      },
    ],
  },
  {
    name: "Liberty",
    slug: "liberty",
    addressLine: "6700 Liberty Rd, Baltimore, MD 21207",
    phone: "410-655-0009",
    hoursLabel: "Sun - Thu: 10am - 10pm\nFri - Sat: 10am - 11pm",
    schedule: [
      {
        days: [0, 1, 2, 3, 4],
        open: "10:00",
        close: "22:00",
      },
      {
        days: [5, 6],
        open: "10:00",
        close: "23:00",
      },
    ],
  },
];

export default function MainStoreSelection() {
  return (
    <section
      id="stores"
      className="w-full px-4 py-20 text-black transition-colors duration-300 dark:bg-[#050505] dark:text-white md:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-9">
          <p className="mb-3 text-[12px] font-black uppercase tracking-[0.35em] text-[#ff3131]">
            Find a Stoko’s near you
          </p>

          <h2 className="text-[34px] font-black leading-tight tracking-[-0.04em] text-black dark:text-white md:text-[42px] lg:text-[44px]">
            Our Locations
          </h2>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {STORES.map((store) => {
            const openNow = isStoreOpen(store.schedule);

            return (
              <article
                key={store.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#121b13]"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black tracking-tight text-black dark:text-white">
                    {store.name}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase ${
                      openNow
                        ? "bg-green-100 text-[#138A3D]"
                        : "bg-[#DA3327] text-white"
                    }`}
                  >
                    {openNow ? "Open Now" : "Closed"}
                  </span>
                </div>

                <div className="mb-4 space-y-4 rounded-[22px]">
                  <div className="flex min-w-0 items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <MapPin size={18} className="shrink-0 text-[#DA3327]" />

                    <p className="min-w-0 truncate whitespace-nowrap text-[14px] font-medium leading-none">
                      {store.addressLine}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                    <Phone size={17} className="shrink-0 text-[#DA3327]" />

                    <a
                      href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}
                      className="text-[14px] font-medium leading-none transition hover:text-[#DA3327]"
                    >
                      {store.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                    <Clock
                      size={17}
                      className="mt-[2px] shrink-0 text-[#DA3327]"
                    />

                    <div className="space-y-4 text-[14px] font-medium leading-none">
                      {store.hoursLabel.split("\n").map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/store/${store.slug}`}
                  className="mt-auto inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#DA3327] px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-[#12863d] group-hover:shadow-lg group-hover:shadow-green-900/20"
                >
                  Order Now
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

function isStoreOpen(schedule: Store["schedule"]) {
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

  if (!weekday || !hourValue || !minuteValue) {
    return false;
  }

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

  if (currentHour === 24) {
    currentHour = 0;
  }

  const currentMinutes = currentHour * 60 + Number(minuteValue);

  const todaySchedule = schedule.find((item) => item.days.includes(currentDay));

  if (!todaySchedule) {
    return false;
  }

  const openMinutes = timeToMinutes(todaySchedule.open);
  const closeMinutes = timeToMinutes(todaySchedule.close);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}