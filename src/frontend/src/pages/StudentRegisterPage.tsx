import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterStudent } from "../hooks/useQueries";

interface Props {
  onBack: () => void;
  onSuccess: (user: AppUser) => void;
}

export default function StudentRegisterPage({ onBack, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const { login, isLoggingIn } = useInternetIdentity();
  const registerMutation = useRegisterStudent();

  const isLoading = isLoggingIn || registerMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
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
      toast.success("Registration successful!");
      onSuccess({
        name: name.trim(),
        id: studentId.trim(),
        email: email.trim(),
        role: "student",
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
            "linear-gradient(135deg, oklch(0.48 0.15 142) 0%, oklch(0.40 0.13 142) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="student_register.back.button"
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
            <h1 className="text-2xl font-bold text-white">
              Student Registration
            </h1>
            <p className="text-white/70 text-sm">
              Join the CampusConnect community
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
        <div className="rounded-2xl bg-[oklch(0.96_0.04_142)] border border-[oklch(0.85_0.06_142)] p-4 mb-6">
          <p className="text-sm font-semibold text-[oklch(0.40_0.13_142)] mb-3">
            What you get:
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Find teachers anywhere on campus",
              "See real-time availability status",
              "Get precise location zones",
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
            <Label htmlFor="sreg-name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              data-ocid="student_register.name.input"
              id="sreg-name"
              placeholder="Alex Martinez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sreg-id" className="text-sm font-semibold">
              Student ID
            </Label>
            <Input
              data-ocid="student_register.id.input"
              id="sreg-id"
              placeholder="STU-2024-1234"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sreg-email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              data-ocid="student_register.email.input"
              id="sreg-email"
              type="email"
              placeholder="alex@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 rounded-xl text-base"
              autoComplete="email"
            />
          </div>
          <Button
            data-ocid="student_register.submit.button"
            type="submit"
            disabled={isLoading}
            className="h-14 rounded-xl text-base font-semibold mt-2"
            style={{ background: "oklch(0.48 0.15 142)", color: "white" }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {isLoading ? "Registering..." : "Register & Explore"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
