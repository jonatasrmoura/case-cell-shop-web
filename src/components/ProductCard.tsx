import { motion } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";

import type { Product } from "../types/products";

interface ProductCardProps {
  product: Product;
  isBuying: boolean;
  onBuy: (productId: string) => void;
  index: number; // Para animar em cascata (stagger)
}

export function ProductCard({
  product,
  isBuying,
  onBuy,
  index,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isButtonDisabled = isOutOfStock || isBuying;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
    >
      <div className="flex-1">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">{product.name}</h2>
        <p className="text-3xl font-extrabold text-blue-600 mb-4">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>

        <div className="mb-6">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
            ${isOutOfStock ? "bg-zinc-100 text-zinc-500" : "bg-blue-50 text-blue-600"}
          `}
          >
            {isOutOfStock
              ? "Esgotado"
              : `${product.stock} unidades disponíveis`}
          </span>
        </div>
      </div>

      {/* Botão: Este container ficará sempre na base devido ao flex-1 do div acima */}
      <div className="mt-auto">
        <button
          onClick={() => onBuy(product.id)}
          disabled={isOutOfStock || isBuying}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center transition-all duration-200 cursor-pointer
            ${
              isOutOfStock
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-950 active:scale-[0.98]"
            }
          `}
        >
          {isBuying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isOutOfStock ? "Indisponível" : "Comprar Agora"}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
