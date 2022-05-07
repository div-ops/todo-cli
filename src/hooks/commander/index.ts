import { useDefault } from "./default";
import { useDue } from "./due";
import { useInstall } from "./install";
import { useLink } from "./link";
import { useLinkRemove } from "./link-remove";
import { useLoad } from "./load";
import { useLog } from "./log";
import { useUpdateProfile } from "./profile";
import { useRemove } from "./remove";
import { useReset } from "./reset";
import { useSave } from "./save";
import { useStorage } from "./storage";
import { useText } from "./text";
import { useTodoAdd } from "./todo-add";
import { useTodoUpdate } from "./todo-update";
import { useUndone } from "./undone";
import { useUninstall } from "./uninstall";

export type Command = keyof ReturnType<typeof useCommander>;

interface CommandProps {
  command: string;
  options: string[];
}

interface OptionalCommandProps {
  command?: string | undefined;
  options: string[];
}

export type CommandFunction = (
  options: CommandProps | OptionalCommandProps
) => Promise<void>;

export function useCommander() {
  return {
    install: useInstall(),
    uninstall: useUninstall(),
    a: useTodoAdd(),
    add: useTodoAdd(),
    progress: useTodoUpdate(),
    removed: useTodoUpdate(),
    ["in-review"]: useTodoUpdate(),
    holding: useTodoUpdate(),
    done: useTodoUpdate(),
    undone: useUndone(),
    r: useRemove(),
    remove: useRemove(),
    l: useLog(),
    log: useLog(),
    link: useLink(),
    text: useText(),
    ["link-remove"]: useLinkRemove(),
    due: useDue(),
    reset: useReset(),
    default: useDefault(),
    p: useUpdateProfile(),
    profile: useUpdateProfile(),
    save: useSave(),
    load: useLoad(),
    storage: useStorage(),
  } as Record<string, CommandFunction>;
}
