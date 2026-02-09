"use server";

import { execute } from "@/lib/commands";

export async function runCommand(command: string) {
  return execute(command);
}
