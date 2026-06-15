import { UsersTableCard } from "./UsersTableCard";

/**
 * UsersPane
 * -----------------------------------------------------------------------------
 * Active settings pane for user management.
 * -----------------------------------------------------------------------------
 */
export function UsersPane() {
  return (
    <section data-section="settings-users-pane" className="min-w-0">
      <header data-section="settings-users-pane-head" className="mb-5">
        <h2 className="mb-1.5 text-2xl font-bold tracking-[-0.015em] text-[#1A1A1A]">
          User management
        </h2>
        <p className="max-w-[560px] text-sm leading-[1.55] text-[#7A7A7A]">
          Add team members, set their access level, or remove anyone you no
          longer need to share with.
        </p>
      </header>
      <UsersTableCard />
    </section>
  );
}