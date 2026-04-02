import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeSwitch } from "@components/theme-switch";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Jueguito", href: "/jueguito", pill: true },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/40 dark:border-slate-700/40">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-1.5 font-melody text-indigo-700 dark:text-indigo-300 text-xl select-none"
          >
            Karen ♥
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            {NAV_LINKS.map(({ label, href, pill }) =>
              pill ? (
                <Link
                  key={href}
                  to={href}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-melody shadow-sm active:scale-95 transition-transform"
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={href}
                  to={href}
                  className={`text-sm font-melody transition-colors ${
                    pathname === href
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  }`}
                >
                  {label}
                </Link>
              ),
            )}
            <ThemeSwitch />
          </div>

          <div className="flex sm:hidden items-center gap-1">
            <ThemeSwitch />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="block text-lg leading-none select-none"
              >
                {open ? "✕" : "☰"}
              </motion.span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-slate-900/20 sm:hidden"
            />

            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="fixed top-14 left-0 right-0 z-50 sm:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-white/40 dark:border-slate-700/40"
            >
              <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-2">
                {NAV_LINKS.map(({ label, href, pill }) =>
                  pill ? (
                    <Link
                      key={href}
                      to={href}
                      onClick={close}
                      className="py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-melody text-lg shadow-sm active:scale-95 transition-transform"
                    >
                      {label}
                    </Link>
                  ) : (
                    <Link
                      key={href}
                      to={href}
                      onClick={close}
                      className={`py-3 rounded-xl text-center font-melody text-lg transition-colors ${
                        pathname === href
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
