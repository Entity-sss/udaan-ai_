import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Signup from "@/pages/Signup";
import Assessment from "@/pages/Assessment";
import AppLayout from "@/pages/AppLayout";
import { getStoredStudent } from "@/lib/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const student = getStoredStudent();
  if (!student) return <Redirect to="/signup" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signup" component={Signup} />
      <Route path="/assessment">
        <AuthGuard>
          <Assessment />
        </AuthGuard>
      </Route>
      <Route path="/dashboard">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/roadmap">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/courses/:courseId">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/courses">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/progress">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/certificates">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route path="/library">
        <AuthGuard>
          <AppLayout />
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
