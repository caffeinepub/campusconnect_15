import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import StudentDashboard from "./pages/StudentDashboard";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import TeacherRegisterPage from "./pages/TeacherRegisterPage";
import WelcomePage from "./pages/WelcomePage";

const queryClient = new QueryClient();

export type Screen =
  | "welcome"
  | "teacher-login"
  | "teacher-register"
  | "teacher-dashboard"
  | "student-login"
  | "student-register"
  | "student-dashboard";

export interface AppUser {
  name: string;
  id: string;
  email: string;
  role: "teacher" | "student";
}

function AppInner() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const navigate = (s: Screen) => setScreen(s);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    if (user.role === "teacher") navigate("teacher-dashboard");
    else navigate("student-dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("welcome");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.93_0.008_264)] flex items-start justify-center py-0 sm:py-8">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-0 sm:rounded-[2rem] overflow-hidden shadow-mobile bg-background">
        {screen === "welcome" && (
          <WelcomePage
            onSelectTeacher={() => navigate("teacher-login")}
            onSelectStudent={() => navigate("student-login")}
          />
        )}
        {screen === "teacher-login" && (
          <TeacherLoginPage
            onBack={() => navigate("welcome")}
            onLogin={handleLogin}
            onRegister={() => navigate("teacher-register")}
          />
        )}
        {screen === "teacher-register" && (
          <TeacherRegisterPage
            onBack={() => navigate("teacher-login")}
            onSuccess={handleLogin}
          />
        )}
        {screen === "teacher-dashboard" && currentUser && (
          <TeacherDashboard user={currentUser} onLogout={handleLogout} />
        )}
        {screen === "student-login" && (
          <StudentLoginPage
            onBack={() => navigate("welcome")}
            onLogin={handleLogin}
            onRegister={() => navigate("student-register")}
          />
        )}
        {screen === "student-register" && (
          <StudentRegisterPage
            onBack={() => navigate("student-login")}
            onSuccess={handleLogin}
          />
        )}
        {screen === "student-dashboard" && currentUser && (
          <StudentDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
