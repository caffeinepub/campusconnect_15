import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterStudent } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
  onLogin: (user: AppUser) => void;
  onRegister: () => void;
}

export default function StudentLoginPage({
  onBack,
  onLogin,
  onRegister,
}: Props) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const { login, isLoggingIn } = useInternetIdentity();
  const registerMutation = useRegisterStudent();

  const isLoading = isLoggingIn || registerMutation.isPending;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await login();
      await registerMutation.mutateAsync({
        name: name.trim(),
        id: studentId.trim(),
        email: email.trim(),
      });
      onLogin({
        name: name.trim(),
        id: studentId.trim(),
        email: email.trim(),
        role: "student",
      });
      toast.success(`Welcome, ${name.trim()}!`);
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - teal/green gradient for student */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.15 142) 0%, oklch(0.40 0.13 142) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="student_login.back.button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Student Login</h1>
            <p className="text-white/70 text-sm">
              Find your teachers on campus
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-5 pt-8"
      >
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="student-name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              data-ocid="student_login.name.input"
              id="student-name"
              placeholder="Alex Martinez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="student-id" className="text-sm font-semibold">
              Student ID
            </Label>
            <Input
              data-ocid="student_login.id.input"
              id="student-id"
              placeholder="STU-2024-1234"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="student-email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              data-ocid="student_login.email.input"
              id="student-email"
              type="email"
              placeholder="alex@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="email"
            />
          </div>
          <Button
            data-ocid="student_login.submit.button"
            type="submit"
            disabled={isLoading}
            className="h-14 rounded-xl text-base font-semibold mt-2"
            style={{ background: "oklch(0.48 0.15 142)", color: "white" }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Signing in..." : "Login with Internet Identity"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            New student?{" "}
            <button
              type="button"
              data-ocid="student_login.register.link"
              onClick={onRegister}
              className="font-semibold hover:underline"
              style={{ color: "oklch(0.48 0.15 142)" }}
            >
              Register here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
