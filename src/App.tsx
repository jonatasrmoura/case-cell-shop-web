import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { api } from "./services/api";
import type { Product } from "./types/products";

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?page=${page}&limit=6`);

      setProducts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      toast.error("Erro ao conectar com a vitrine.");
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    setLoadingApp(true);
    fetchProducts();
  }, [page]);

  const handleCheckout = async (productId: string) => {
    setBuyingProductId(productId);
    const idempotencyKey = crypto.randomUUID();

    try {
      await api.post(
        "/checkout",
        { productId, quantity: 1 },
        { headers: { "x-idempotency-key": idempotencyKey } },
      );

      toast.success("Pedido confirmado com sucesso!");
      await fetchProducts();
    } catch (error: any) {
      const status = error.response?.status;

      switch (status) {
        case 409:
          toast.error("Poxa, outra pessoa comprou a última unidade.");
          await fetchProducts();
          break;
        case 503:
          toast.error(
            "O sistema de faturamento do ERP está instável. Tente novamente.",
            {
              icon: <AlertTriangle className="text-amber-500" />,
            },
          );
          break;
        case 400:
          toast.error("Dados de compra inválidos.");
          break;
        default:
          toast.error("Ocorreu um erro inesperado ao processar o pagamento.");
      }
    } finally {
      setBuyingProductId(null);
    }
  };

  if (loadingApp && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <Toaster position="top-right" richColors />

      <main className="max-w-5xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {loadingApp && products.length > 0 && (
            <div className="absolute inset-0 bg-zinc-50/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
            </div>
          )}

          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isBuying={buyingProductId === product.id}
              onBuy={handleCheckout}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loadingApp}
              className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-zinc-600">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loadingApp}
              className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
