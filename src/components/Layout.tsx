
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";

export function Layout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
