import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, LogOut, MapPin, RefreshCw, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppUser } from "../App";
import type { Teacher } from "../backend.d";
import {
  Type,
  useGetAllTeachers,
  useSearchTeachers,
} from "../hooks/useQueries";

interface Props {
  user: AppUser;
  onLogout: () => void;
}

const ZONE_LABELS: Record<string, { label: string; emoji: string }> = {
  [Type.blockA]: { label: "Block A", emoji: "🏢" },
  [Type.blockB]: { label: "Block B", emoji: "🏗️" },
  [Type.lab]: { label: "Lab", emoji: "🔬" },
  [Type.library]: { label: "Library", emoji: "📚" },
  [Type.foodCourt]: { label: "Food Court", emoji: "🍽️" },
  [Type.parking]: { label: "Parking", emoji: "🅿️" },
};

function TeacherCard({ teacher, index }: { teacher: Teacher; index: number }) {
  const initials = teacher.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const zone = teacher.locationZone ? ZONE_LABELS[teacher.locationZone] : null;

  return (
    <motion.div
      data-ocid={`student_dashboard.teacher.item.${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <div
        className={`w-13 h-13 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${teacher.isAvailable ? "bg-gradient-to-br from-primary to-[oklch(0.42_0.22_264)]" : "bg-muted text-muted-foreground"}`}
      >
        <span
          className={
            teacher.isAvailable ? "text-white" : "text-muted-foreground"
          }
        >
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground text-base truncate">
            {teacher.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              teacher.isAvailable
                ? "bg-success/15 text-[oklch(0.45_0.17_142)]"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${teacher.isAvailable ? "bg-accent" : "bg-destructive"}`}
            />
            {teacher.isAvailable ? "Available" : "Offline"}
          </span>
          {/* Location */}
          {zone && teacher.isOnCampus && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>
                {zone.emoji} {zone.label}
              </span>
            </span>
          )}
          {!teacher.isOnCampus && (
            <span className="text-xs text-muted-foreground">Off campus</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentDashboard({ user, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const allTeachersQuery = useGetAllTeachers();
  const searchQuery = useSearchTeachers(search);

  const teachers = search.trim()
    ? (searchQuery.data ?? [])
    : (allTeachersQuery.data ?? []);
  const isLoading = search.trim()
    ? searchQuery.isLoading
    : allTeachersQuery.isLoading;
  const isRefetching = search.trim()
    ? searchQuery.isFetching
    : allTeachersQuery.isFetching;

  const availableCount = teachers.filter((t) => t.isAvailable).length;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleRefresh = () => {
    allTeachersQuery.refetch();
    if (search.trim()) searchQuery.refetch();
    toast.success("Refreshed");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.97_0.008_264)]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.15 142) 0%, oklch(0.40 0.13 142) 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold">
              {initials}
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                Welcome back
              </p>
              <h1 className="text-white font-bold text-lg leading-tight">
                {user.name}
              </h1>
            </div>
          </div>
          <button
            type="button"
            data-ocid="student_dashboard.logout.button"
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            data-ocid="student_dashboard.search.input"
            type="search"
            placeholder="Search teachers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/20 text-white placeholder:text-white/60 text-base outline-none focus:bg-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{teachers.length}</span>{" "}
            teachers
            {availableCount > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="font-bold text-accent">
                  {availableCount} available
                </span>
              </>
            )}
          </span>
        </div>
        <button
          type="button"
          data-ocid="student_dashboard.refresh.button"
          onClick={handleRefresh}
          className={`flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ${isRefetching ? "animate-spin text-primary" : ""}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isRefetching ? "" : "Refresh"}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto">
        {isLoading ? (
          <div
            data-ocid="student_dashboard.loading_state"
            className="flex flex-col gap-3"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-13 h-13 rounded-2xl bg-muted flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <motion.div
            data-ocid="student_dashboard.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1">
              {search.trim() ? "No teachers found" : "No teachers yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {search.trim()
                ? `No results for "${search}"`
                : "Teachers will appear here once they join"}
            </p>
            {search.trim() && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
                className="mt-4 rounded-xl"
              >
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="sync">
            <div className="flex flex-col gap-3">
              {teachers.map((teacher, i) => (
                <TeacherCard key={teacher.id} teacher={teacher} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
