import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterTeacher } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
  onSuccess: (user: AppUser) => void;
}

export default function TeacherRegisterPage({ onBack, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const { login, isLoggingIn } = useInternetIdentity();
  const registerMutation = useRegisterTeacher();

  const isLoading = isLoggingIn || registerMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !employeeId.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await login();
      await registerMutation.mutateAsync({
        name: name.trim(),
        id: employeeId.trim(),
        email: email.trim(),
      });
      toast.success("Registration successful!");
      onSuccess({
        name: name.trim(),
        id: employeeId.trim(),
        email: email.trim(),
        role: "teacher",
      });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.488 0.243 264) 0%, oklch(0.42 0.22 264) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="teacher_register.back.button"
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
            <h1 className="text-2xl font-bold text-white">
              Teacher Registration
            </h1>
            <p className="text-white/70 text-sm">Create your faculty account</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 px-5 pt-8"
      >
        {/* Benefits */}
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 mb-6">
          <p className="text-sm font-semibold text-primary mb-3">
            What you get:
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Auto-detect your campus location",
              "Students can find you instantly",
              "One-tap availability toggle",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              data-ocid="teacher_register.name.input"
              id="reg-name"
              placeholder="Dr. Sarah Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-id" className="text-sm font-semibold">
              Employee ID
            </Label>
            <Input
              data-ocid="teacher_register.id.input"
              id="reg-id"
              placeholder="EMP-2024-001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              data-ocid="teacher_register.email.input"
              id="reg-email"
              type="email"
              placeholder="sarah@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="email"
            />
          </div>
          <Button
            data-ocid="teacher_register.submit.button"
            type="submit"
            disabled={isLoading}
            className="h-14 rounded-xl text-base font-semibold mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Registering..." : "Register & Connect"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
