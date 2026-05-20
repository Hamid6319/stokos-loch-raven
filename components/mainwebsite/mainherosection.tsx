import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MainHeroSection() {
  return (
    <section className="w-full px-4 pt-4 md:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[22px] bg-[#005321] shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:h-[576px]">
        {/* Desktop Background Image */}
        <Image
          src="/images/mainwebsitehero4.png"
          alt="Stoko's fresh pizza and deals"
          fill
          priority
          className="hidden object-contain object-right md:block"
        />

        {/* Desktop Smooth Overlay */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#005321_0%,#005321_34%,rgba(0,83,33,0.96)_43%,rgba(0,83,33,0.78)_48%,rgba(0,83,33,0.35)_58%,rgba(0,83,33,0.12)_74%,rgba(0,83,33,0)_88%)] md:block" />

        {/* Desktop Light Tint */}
        <div className="absolute inset-0 hidden bg-black/5 md:block" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:h-full md:max-w-[620px] md:justify-center md:px-14">
          <div className="px-6 pb-8 pt-8 sm:px-8 sm:pt-10 md:px-0 md:py-0">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-md bg-green-700">
              <span className="h-2 w-2 rounded-full bg-[#DA3327]" />
              Limited Time Deal
            </div>

            <h1 className="max-w-[560px] text-[39px] font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-[48px] md:text-[64px] lg:text-[68px]">
              Hot Deals,
              <br />
              Fresh Food,
              <br />
              <span className="text-[#DA3327]">Fast Delivery.</span>
            </h1>

            <p className="mt-6 max-w-[460px] text-[17px] font-medium leading-[1.55] text-white/95 sm:text-[18px] md:mt-7 md:text-[20px]">
              Order pizza, subs, wings, breakfast and more from your nearest
              Stoko&apos;s location.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/mainwebsite/location?action=menu"
                className="inline-flex h-[52px] min-w-[185px] items-center justify-center gap-2 rounded-full bg-[#DA3327] px-7 text-[15px] font-extrabold uppercase tracking-wide text-white shadow-[0_12px_25px_rgba(218,51,39,0.28)] transition hover:bg-[#c22b20]"
              >
                Start Order
                <ArrowRight size={18} strokeWidth={3} />
              </Link>

              <Link
                href="/mainwebsite/location?action=menu"
                className="inline-flex h-[52px] min-w-[155px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-[15px] font-extrabold uppercase tracking-wide text-white backdrop-blur-md transition hover:bg-white/18"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* Mobile Bottom Image */}
          <div className="relative h-[280px] w-full overflow-hidden md:hidden">
            <Image
              src="/images/mainwebsitehero4.png"
              alt="Stoko's pizza"
              fill
              priority
              className="object-cover object-bottom"
            />

            {/* Green blend over mobile image */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#005321_0%,rgba(0,83,33,0.80)_8%,rgba(0,83,33,0.35)_35%,rgba(0,83,33,0.10)_100%)]" />
            <div className="absolute inset-0 bg-[#005321]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}