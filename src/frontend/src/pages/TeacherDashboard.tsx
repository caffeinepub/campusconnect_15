import { Button } from "@/components/ui/button";
import { BookOpen, Info, LogOut, MapPin, Wifi, WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import {
  Type,
  useSetCampusPresence,
  useSetLocationZone,
  useToggleAvailability,
} from "../hooks/useQueries";

interface Props {
  user: AppUser;
  onLogout: () => void;
}

const ZONES: { value: Type; label: string; emoji: string }[] = [
  { value: Type.blockA, label: "Block A", emoji: "🏢" },
  { value: Type.blockB, label: "Block B", emoji: "🏗️" },
  { value: Type.lab, label: "Lab", emoji: "🔬" },
  { value: Type.library, label: "Library", emoji: "📚" },
  { value: Type.foodCourt, label: "Food Court", emoji: "🍽️" },
  { value: Type.parking, label: "Parking", emoji: "🅿️" },
];

export default function TeacherDashboard({ user, onLogout }: Props) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isOnCampus, setIsOnCampus] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Type>(Type.blockA);

  const toggleAvail = useToggleAvailability();
  const setCampus = useSetCampusPresence();
  const setZone = useSetLocationZone();

  const handleAvailabilityToggle = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    try {
      await toggleAvail.mutateAsync(next);
      toast.success(next ? "You are now available" : "You are now offline");
    } catch {
      setIsAvailable(!next);
      toast.error("Failed to update availability");
    }
  };

  const handleCampusToggle = async () => {
    const next = !isOnCampus;
    setIsOnCampus(next);
    // Auto-set offline when leaving campus
    if (!next && isAvailable) {
      setIsAvailable(false);
      toggleAvail.mutate(false);
    }
    try {
      await setCampus.mutateAsync(next);
      toast.success(next ? "On campus" : "Left campus — status set to Offline");
    } catch {
      setIsOnCampus(!next);
      toast.error("Failed to update campus status");
    }
  };

  const handleZoneSelect = async (zone: Type) => {
    setSelectedZone(zone);
    try {
      await setZone.mutateAsync(zone);
      const zoneLabel = ZONES.find((z) => z.value === zone)?.label ?? zone;
      toast.success(`Location set to ${zoneLabel}`);
    } catch {
      toast.error("Failed to update location");
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.97_0.008_264)]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.488 0.243 264) 0%, oklch(0.42 0.22 264) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                Welcome back
              </p>
              <h1 className="text-white font-bold text-xl leading-tight">
                {user.name}
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-xs">{user.id}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            data-ocid="teacher_dashboard.logout.button"
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-8 flex flex-col gap-4 overflow-y-auto">
        {/* Availability Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-foreground">
                Availability
              </h2>
              <p className="text-sm text-muted-foreground">
                Let students know you're here
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isAvailable ? "available" : "offline"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isAvailable
                    ? "bg-success/15 text-[oklch(0.55_0.18_142)]"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isAvailable ? "● Available" : "● Offline"}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Big Toggle */}
          <button
            type="button"
            data-ocid="teacher_dashboard.availability.toggle"
            onClick={handleAvailabilityToggle}
            disabled={!isOnCampus || toggleAvail.isPending}
            className={`w-full h-20 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-xl transition-all duration-300 relative overflow-hidden ${
              !isOnCampus
                ? "bg-muted cursor-not-allowed opacity-60"
                : isAvailable
                  ? "bg-gradient-to-r from-[oklch(0.72_0.198_142)] to-[oklch(0.65_0.18_142)] shadow-[0_4px_20px_oklch(0.72_0.198_142/0.4)] hover:shadow-[0_6px_24px_oklch(0.72_0.198_142/0.5)] active:scale-[0.98]"
                  : "bg-gradient-to-r from-[oklch(0.55_0.02_264)] to-[oklch(0.50_0.02_264)] hover:from-[oklch(0.50_0.02_264)] active:scale-[0.98]"
            }`}
          >
            {isAvailable ? (
              <>
                <Wifi className="w-7 h-7" />
                <span>I&apos;m Available</span>
              </>
            ) : (
              <>
                <WifiOff className="w-7 h-7" />
                <span>I&apos;m Offline</span>
              </>
            )}
            <div
              className={`absolute right-5 w-12 h-7 rounded-full transition-colors duration-300 ${isAvailable ? "bg-white/30" : "bg-white/10"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all duration-300 ${isAvailable ? "right-1" : "left-1"}`}
              />
            </div>
          </button>

          {!isOnCampus && (
            <p className="text-xs text-destructive mt-2 text-center">
              Go to campus to toggle availability
            </p>
          )}
        </motion.div>

        {/* Campus Presence */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnCampus ? "bg-success/10" : "bg-muted"}`}
              >
                <MapPin
                  className={`w-5 h-5 ${isOnCampus ? "text-accent" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  Campus Presence
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isOnCampus ? "You are on campus" : "You are off campus"}
                </p>
              </div>
            </div>
            <button
              type="button"
              data-ocid="teacher_dashboard.campus.toggle"
              onClick={handleCampusToggle}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOnCampus ? "bg-accent" : "bg-muted"}`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${isOnCampus ? "right-0.5" : "left-0.5"}`}
              />
            </button>
          </div>
        </motion.div>

        {/* Auto-location info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Auto-location active inside campus
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Your location is auto-detected and mapped to campus zones. When
              you leave campus, your status automatically goes Offline.
            </p>
          </div>
        </motion.div>

        {/* Location Zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-5"
        >
          <h3 className="font-bold text-foreground mb-1">
            Current Location Zone
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Where are you right now?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ZONES.map((zone) => (
              <button
                type="button"
                key={zone.value}
                data-ocid="teacher_dashboard.zone.button"
                onClick={() => handleZoneSelect(zone.value)}
                className={`rounded-xl p-3 flex flex-col items-center gap-1.5 border-2 transition-all duration-200 text-center ${
                  selectedZone === zone.value
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{zone.emoji}</span>
                <span
                  className={`text-xs font-semibold ${selectedZone === zone.value ? "text-primary" : "text-foreground"}`}
                >
                  {zone.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <Button
          data-ocid="teacher_dashboard.signout.button"
          variant="outline"
          onClick={onLogout}
          className="w-full h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
