import { BookOpen, GraduationCap, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onSelectTeacher: () => void;
  onSelectStudent: () => void;
}

export default function WelcomePage({
  onSelectTeacher,
  onSelectStudent,
}: Props) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.95 0.03 264) 0%, oklch(1 0 0) 50%, oklch(0.96 0.04 142) 100%)",
      }}
    >
      {/* Hero top */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/campus-hero.dim_1200x600.jpg"
          alt="Campus"
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Campus<span className="text-[oklch(0.85_0.16_142)]">Connect</span>
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/90 text-sm font-medium"
          >
            Find your faculty, instantly
          </motion.p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 px-5 pt-6 pb-8 flex flex-col gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground text-sm font-medium mb-2"
        >
          Select your role to continue
        </motion.p>

        {/* Teacher Card */}
        <motion.button
          data-ocid="welcome.teacher.button"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          onClick={onSelectTeacher}
          className="group w-full rounded-2xl p-6 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 text-left flex items-center gap-5 border border-border hover:border-primary/30 active:scale-[0.98]"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">Teacher</h2>
            <p className="text-sm text-muted-foreground leading-snug">
              Manage your availability and let students find you on campus
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
            <span className="text-primary group-hover:text-white text-lg leading-none transition-colors">
              &rsaquo;
            </span>
          </div>
        </motion.button>

        {/* Student Card */}
        <motion.button
          data-ocid="welcome.student.button"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          onClick={onSelectStudent}
          className="group w-full rounded-2xl p-6 bg-primary shadow-card hover:shadow-card-hover transition-all duration-300 text-left flex items-center gap-5 active:scale-[0.98]"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">Student</h2>
            <p className="text-sm text-white/80 leading-snug">
              Search for teachers and find them anywhere on campus
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
            <span className="text-white text-lg leading-none">&rsaquo;</span>
          </div>
        </motion.button>

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {[
            { icon: "📍", label: "Real-time\nLocation" },
            { icon: "🟢", label: "Live\nAvailability" },
            { icon: "🔍", label: "Instant\nSearch" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl bg-white shadow-xs p-3 text-center border border-border"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-[11px] font-medium text-muted-foreground whitespace-pre-line leading-tight">
                {f.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="pb-6 text-center text-xs text-muted-foreground px-5">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
