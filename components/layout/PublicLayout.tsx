import Footer from "./Footer";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <LeftSidebar />
      <div className="lg:pl-12">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
