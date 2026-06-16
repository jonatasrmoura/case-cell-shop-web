import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 text-center md:text-left"
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
        CaseCellShop
      </h1>
      <p className="text-zinc-500 mt-2 text-lg">
        Acessórios premium para o seu dia a dia.
      </p>
    </motion.header>
  );
}
