import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/useLanguage";
import HeroSearch from "./HeroSearch";
import LocalConditions from "../ui/LocalConditions";

const heroSlides = [
  {
    src: "/hero/pagbilao-grande-island.jpg",
    alt: "Aerial view of Pagbilao Grande Island and Tayabas Bay",
    credit: "Photo: Patrickroque01, CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Pagbilao_Grande_Island_from_air_(Quezon;_12-09-2023).jpg",
  },
  {
    src: "/hero/maharlika-highway-pagbilao.jpg",
    alt: "Maharlika Highway in Pagbilao, Quezon",
    credit: "Photo: Ralff Nestor Nacor, CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Maharlika_Highway,_Pagbilao,_Quezon,_May_2025.jpg",
  },
  {
    src: "/hero/diversion-road-pagbilao.jpg",
    alt: "Diversion Road in Pagbilao, Quezon",
    credit: "Photo: Ralff Nestor Nacor, CC BY-SA 4.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Diversion_Road,_Pagbilao,_Quezon,_Feb_2024_(2).jpg",
  },
];

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
            className={[
              "absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out",
              index === activeSlide ? "scale-105 opacity-100" : "scale-100 opacity-0",
            ].join(" ")}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/68 to-slate-950/20"></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent"></div>
      </div>

      <div className="relative mx-auto grid min-h-136 max-w-[1600px] place-items-center px-4 py-16 sm:min-h-160 sm:px-6 sm:py-20 lg:min-h-170 lg:px-8 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-white">
          <div className="relative mb-5 flex w-full flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold backdrop-blur">
              <MapPin className="h-4 w-4" />
              <span>{t.hero.locationBadge}</span>
            </div>
            <LocalConditions />
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/88">
            {t.hero.description}
          </p>

          <HeroSearch />

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <a
              href="#services"
              className="rounded-md bg-white/[0.14] px-3 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/22"
            >
              {t.hero.chips.businessPermit}
            </a>
            <a
              href="#services"
              className="rounded-md bg-white/[0.14] px-3 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/22"
            >
              {t.hero.chips.civilRegistry}
            </a>
            <a
              href="#hotlines"
              className="rounded-md bg-white/[0.14] px-3 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/22"
            >
              {t.hero.chips.emergencyHotlines}
            </a>
            <a
              href="#tourism"
              className="rounded-md bg-white/[0.14] px-3 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/22"
            >
              {t.hero.chips.wowPagbilao}
            </a>
          </div>
          <a
            href={heroSlides[activeSlide].creditUrl}
            className="mt-5 inline-block text-xs font-semibold text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            {heroSlides[activeSlide].credit}
          </a>
        </div>

        <div
          className="absolute bottom-8 right-4 flex items-center gap-2 rounded-md bg-white/12 p-2 ring-1 ring-white/20 backdrop-blur sm:right-6 lg:right-8"
          aria-label="Hero image selector"
        >
          {heroSlides.map((slide, index) => {
            const isActive = index === activeSlide;

            return (
              <button
                key={slide.src}
                type="button"
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  isActive ? "w-8 bg-white" : "w-2.5 bg-white/45",
                ].join(" ")}
                aria-label={`Show ${slide.alt}`}
                onClick={() => setActiveSlide(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
