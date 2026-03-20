import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterTeacher } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
  onLogin: (user: AppUser) => void;
  onRegister: () => void;
}

export default function TeacherLoginPage({
  onBack,
  onLogin,
  onRegister,
}: Props) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const { login, isLoggingIn } = useInternetIdentity();
  const registerMutation = useRegisterTeacher();

  const isLoading = isLoggingIn || registerMutation.isPending;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !employeeId.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      login();
      await registerMutation.mutateAsync({
        name: name.trim(),
        id: employeeId.trim(),
        email: email.trim(),
      });
      onLogin({
        name: name.trim(),
        id: employeeId.trim(),
        email: email.trim(),
        role: "teacher",
      });
      toast.success(`Welcome, ${name.trim()}!`);
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.488 0.243 264) 0%, oklch(0.42 0.22 264) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="teacher_login.back.button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Teacher Login</h1>
            <p className="text-white/70 text-sm">
              Sign in to manage your availability
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-5 pt-8"
      >
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="teacher-name"
              className="text-sm font-semibold text-foreground"
            >
              Full Name
            </Label>
            <Input
              data-ocid="teacher_login.name.input"
              id="teacher-name"
              placeholder="Dr. Sarah Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-13 rounded-xl text-base border-border focus:border-primary"
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="teacher-id"
              className="text-sm font-semibold text-foreground"
            >
              Employee ID
            </Label>
            <Input
              data-ocid="teacher_login.id.input"
              id="teacher-id"
              placeholder="EMP-2024-001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="h-13 rounded-xl text-base border-border focus:border-primary"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="teacher-email"
              className="text-sm font-semibold text-foreground"
            >
              Email Address
            </Label>
            <Input
              data-ocid="teacher_login.email.input"
              id="teacher-email"
              type="email"
              placeholder="sarah@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-xl text-base border-border focus:border-primary"
              autoComplete="email"
            />
          </div>

          <Button
            data-ocid="teacher_login.submit.button"
            type="submit"
            disabled={isLoading}
            className="h-14 rounded-xl text-base font-semibold mt-2 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Signing in..." : "Login with Internet Identity"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            New teacher?{" "}
            <button
              type="button"
              data-ocid="teacher_login.register.link"
              onClick={onRegister}
              className="text-primary font-semibold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
