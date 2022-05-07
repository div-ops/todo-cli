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

export function useCommander() {
  return {
    install: useInstall(),
    uninstall: useUninstall(),
    todoAdd: useTodoAdd(),
    todoUpdate: useTodoUpdate(),
    undone: useUndone(),
    remove: useRemove(),
    log: useLog(),
    link: useLink(),
    text: useText(),
    linkRemove: useLinkRemove(),
    due: useDue(),
    reset: useReset(),
    default: useDefault(),
    updateProfile: useUpdateProfile(),
    save: useSave(),
    load: useLoad(),
    storage: useStorage(),
  };
}
