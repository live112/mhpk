import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/navbar";

export const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="backdrop-blur-md bg-purple-600/90 dark:bg-purple-900/90 border-b border-purple-400/30"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <span className="text-white text-xl">♥</span>
            <p className="font-bold text-white">Karen</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent> */}

      {/* <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle className="text-white" />
      </NavbarContent> */}

      {/* <NavbarMenu className="backdrop-blur-md bg-purple-600/90 dark:bg-purple-900/90">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full text-white/80 hover:text-white transition-colors"
                href={item.href}
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
    </HeroUINavbar>
  );
};
