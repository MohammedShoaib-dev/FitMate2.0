import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import ChatBot from "@/components/ChatBot";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBanner?: boolean;
}

const AppLayout = ({ children, title, subtitle, showBanner = false }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={title} subtitle={subtitle} showBanner={showBanner} />
      <main className="animate-fade-in">{children}</main>
      <ChatBot />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
