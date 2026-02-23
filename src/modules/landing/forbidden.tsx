import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Forbidden() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem("heroui-theme");
      const isDark =
        theme === "dark" || document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });

    window.addEventListener("themeChanged", checkTheme);
    window.addEventListener("storage", checkTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("themeChanged", checkTheme);
      window.removeEventListener("storage", checkTheme);
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${
        isDarkMode
          ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-black to-black"
          : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-white to-indigo"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden-z-50">
        <div
          className={`absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-float ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20"
              : "bg-gradient-to-r from-blue-400/30 to-blue-500/30"
          }`}
        ></div>
        <div
          className={`absolute top-40 right-32 w-24 h-24 rounded-full blur-lg animate-float ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20"
              : "bg-gradient-to-r from-purple-400/30 to-purple-500/30"
          }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute bottom-32 left-1/4 w-40 h-40 rounded-full blur-2xl animate-float ${
            isDarkMode
              ? "bg-gradient-to-r from-yellow-500/15 to-yellow-600/15"
              : "bg-gradient-to-r from-yellow-400/25 to-yellow-500/25"
          }`}
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
      >
        <Card
          className={`backdrop-blur-sm ${isDarkMode ? "bg-slate-900/70 border-slate-700" : "bg-white/80 border-blue-200"}`}
        >
          <CardBody className="text-center p-8 space-y-6">
            <div
              className={`p-4 rounded-full mx-auto w-fit ${isDarkMode ? "bg-gradient-to-br from-red-900/20 to-red-800/30" : "bg-gradient-to-br from-danger-50 to-danger-100"}`}
            >
              <Icon
                icon="heroicons:shield-exclamation-20-solid"
                className="w-16 h-16 text-danger-500"
              />
            </div>

            <h1
              className={`text-3xl font-bold bg-gradient-to-r from-danger-500 to-danger-700 bg-clip-text text-transparent`}
            >
              {"authentication:Forbidden.Title"}
            </h1>

            <p
              className={`text-lg ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              {"authentication:Forbidden.Description"}
            </p>

            <Button
              color="danger"
              variant="solid"
              size="lg"
              className="w-full font-semibold group"
              startContent={
                <span className="group-hover:-translate-x-1 transition-transform">
                  <Icon
                    icon="heroicons:arrow-left-20-solid"
                    className="w-5 h-5"
                  />
                </span>
              }
              onClick={() => navigate(-1)}
            >
              {"authentication:Forbidden.Button"}
            </Button>

            <div
              className={`pt-4 border-t ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}
            >
              <p className="text-sm text-slate-500">
                {"authentication:Forbidden.Note"}
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
