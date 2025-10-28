"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Store, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreNotFound({ id }: { id?: string }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur rounded-xl border border-black/10 p-8 max-w-md w-full text-center shadow-sm"
      >
        <div className="mx-auto h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
          <Store size={22} />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Store not available</h2>
        <p className="mt-2 text-sm text-gray-600">
          This store is not available for use{` `}
          <span className="font-medium">{id ?? "(unknown)"}</span>.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/signup">
            <Button className="gap-2">
              <Plus size={16} /> Create your store
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
