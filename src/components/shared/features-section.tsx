"use client";

import { motion } from "framer-motion";
import { Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Produk digital dikirim langsung ke email Anda dalam hitungan menit",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description: "Transaksi dijamin aman dengan berbagai metode pembayaran terpercaya",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-xl flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-gray-900 dark:text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
