"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Icon } from "~/components/ui/icon";
import { LandingTriviaDemo } from "./LandingTriviaDemo";

export function LandingHero() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    const commit = () => {
      stage.style.setProperty("--field-far-x", `${pointerX * 4}px`);
      stage.style.setProperty("--field-far-y", `${pointerY * 4}px`);
      stage.style.setProperty("--field-far-scroll", `${scrollProgress * -8}px`);
      stage.style.setProperty("--field-mid-x", `${pointerX * 8}px`);
      stage.style.setProperty("--field-mid-y", `${pointerY * 8}px`);
      stage.style.setProperty("--field-mid-scroll", `${scrollProgress * -16}px`);
      stage.style.setProperty("--field-near-x", `${pointerX * 12}px`);
      stage.style.setProperty("--field-near-y", `${pointerY * 12}px`);
      stage.style.setProperty("--field-near-scroll", `${scrollProgress * -26}px`);
      frame = 0;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(commit);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      schedule();
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    };

    const handleScroll = () => {
      const bounds = stage.getBoundingClientRect();
      const travelled = Math.min(Math.max(-bounds.top, 0), bounds.height);
      scrollProgress = travelled / bounds.height;
      schedule();
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="kinetic-stage page-shell flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center py-12 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="hero-field-lilac kinetic-layer-near absolute top-[16%] right-[4%] -z-10 h-24 w-24 opacity-85 sm:h-32 sm:w-32"
      />

      <svg
        aria-hidden="true"
        className="kinetic-layer-mid text-info pointer-events-none absolute inset-x-[-8%] top-[23%] -z-10 h-[62%] w-[116%] overflow-visible opacity-75"
        viewBox="0 0 1200 560"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 120C180 12 298 250 492 205C695 158 670 30 886 55C1072 77 1030 290 1240 248"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M110 510C305 402 390 520 560 455C760 378 806 300 1085 360"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="8 15"
        />
      </svg>

      <div className="field-enter relative z-10 max-w-[58rem]">
        <h1 className="font-display text-[clamp(3.25rem,8vw,6rem)] leading-[0.98] font-bold tracking-[-0.03em] text-balance">
          Adu pengetahuan.
          <span className="block">Bukan sekadar isi kuis.</span>
        </h1>
        <p className="text-muted-foreground mt-7 max-w-[62ch] text-lg leading-8 sm:text-xl">
          Pilih topik, tantang satu teman, lalu jawab pertanyaan yang sama. Skor tetap rahasia
          sampai ronde terakhir supaya hasilnya benar-benar terasa.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/signup" className="button-link button-link-primary px-5">
            Buat room pertamamu
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </Link>
          <a
            href="#cara-main"
            className="text-foreground hover:text-primary inline-flex min-h-11 items-center gap-2 py-2 text-sm font-bold transition-colors"
          >
            Lihat alur permainannya
            <Icon name="lucide:arrow-right" aria-hidden="true" className="size-4" />
          </a>
        </div>
        <p className="text-muted-foreground mt-5 text-sm font-medium">
          Pengetahuan umum, teknologi, pop culture, dan topik buatan komunitas.
        </p>
      </div>

      <div className="relative z-10 mt-12 ml-auto w-full max-w-[48rem] lg:-mt-8 lg:mr-[2%]">
        <LandingTriviaDemo />
      </div>
    </section>
  );
}
