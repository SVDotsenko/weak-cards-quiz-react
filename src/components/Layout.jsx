import { useApp } from "../app/useApp";
import Navigation from "./Navigation";
import Toast from "./Toast";

function Layout({ children }) {
  const { toast } = useApp();

  return (
    <div className="app-shell">
      <Navigation />
      <main>{children}</main>
      <Toast toast={toast} />
    </div>
  );
}

export default Layout;
