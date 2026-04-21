"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function SectionLink({
  sectionId,
  className,
  children,
  onNavigate,
}: {
  sectionId: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();

    if (pathname === "/") {
      event.preventDefault();
      scrollToSection();
      return;
    }

    sessionStorage.setItem("gg-scroll-target", sectionId);
    event.preventDefault();
    router.push("/");
  };

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
