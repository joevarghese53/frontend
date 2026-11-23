"use client";

import { motion } from "framer-motion";

function BrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-black text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.12),transparent_50%)]" />

      <div className="relative p-14">

        <h2 className="tracking-[8px] text-lg font-semibold">
          FLOW STATE
        </h2>

        <div className="mt-20">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold leading-tight"
          >
            Design your
            <br />
            dream.
            <br />
            Wear your vibe.
          </motion.h1>

          <p className="mt-8 text-lg text-neutral-300 max-w-md">
            Premium custom apparel crafted for creators, dreamers and people
            that refuse to blend in.
          </p>

        </div>
      </div>

      <div className="relative flex justify-center pb-20">

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="h-80 w-80 rounded-3xl bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,.5)] flex items-center justify-center"
        >
          <span className="text-5xl font-bold tracking-widest">
            FLOW
          </span>
        </motion.div>

      </div>

      <div className="flex justify-center gap-10 pb-10 text-sm text-neutral-400">

        <span>✦ Unique Designs</span>

        <span>⚡ Premium Quality</span>

        <span>🚚 Fast Delivery</span>

      </div>

    </div>
  );
}

export { BrandPanel };