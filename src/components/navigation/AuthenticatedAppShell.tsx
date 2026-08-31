import type { ReactNode } from "react";

import { AppNavigation } from "./AppNavigation";

type AuthenticatedAppShellProps = {
  children: ReactNode;
  user: {
    name: string;
    image?: string | null;
  };
};

export function AuthenticatedAppShell({ children, user }: AuthenticatedAppShellProps) {
  return (
    <div className="bg-background min-h-screen pb-20 md:pb-0">
      <AppNavigation user={user} />
      {children}
    </div>
  );
}
