import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { api } from "./services/api";
import type { Product } from "./types/products";

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      toast.error("Erro ao conectar com a vitrine.");
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      await fetchProducts(); // Atualiza a vitrine para refletir o novo estoque
    } catch (error: any) {
      const status = error.response?.status;

      switch (status) {
        case 409:
          toast.error("Poxa, outra pessoa comprou a última unidade.");
          await fetchProducts(); // Força atualização do estoque visual
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

  if (loadingApp) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}
