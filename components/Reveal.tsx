"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = "center",
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="num text-xs uppercase tracking-[0.18em] text-primary-light">{kicker}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-pretty text-base leading-relaxed text-fg-medium">{description}</p>}
    </div>
  );
}
