import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

// Use following code if you want to use browser integration for MSW
// async function enableMocking() {
//   if (process.env.NODE_ENV !== "development") {
//     return;
//   }

//   const { worker } = await import("./mocks/browser");
//   return worker.start();
// }
// enableMocking().then(() => {
//   createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//       <QueryClientProvider client={queryClient}>
//         <App />
//         <ReactQueryDevtools initialIsOpen={false} />
//       </QueryClientProvider>
//     </StrictMode>
//   );
// });
