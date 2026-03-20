import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Teacher } from "../backend.d";
import { Type } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllTeachers() {
  const { actor, isFetching } = useActor();
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeachers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useSearchTeachers(searchString: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Teacher[]>({
    queryKey: ["teachers", "search", searchString],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchTeachersByName(searchString);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });
}

export function useRegisterTeacher() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      id,
      email,
    }: { name: string; id: string; email: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.registerTeacher(name, id, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useRegisterStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      id,
      email,
    }: { name: string; id: string; email: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.registerStudent(name, id, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      if (!actor) throw new Error("No actor");
      await actor.toggleAvailability(isAvailable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useSetCampusPresence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isOnCampus: boolean) => {
      if (!actor) throw new Error("No actor");
      await actor.setCampusPresence(isOnCampus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export function useSetLocationZone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (zone: Type) => {
      if (!actor) throw new Error("No actor");
      await actor.setLocationZone(zone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
}

export { Type };
