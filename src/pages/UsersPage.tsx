import {
  UsersPane,
  UsersShell,
} from "@/components/users";
import {
  SettingsLayout,
  SettingsPageHeading,
  SettingsSidebar,
} from "@/components/settings";
import { UsersProvider } from "@/providers/UsersProvider";

export function UsersPage() {
  return (
    <UsersProvider>
      <UsersShell>
        <main
          data-page="settings-users"
          className="mx-auto w-full max-w-[1280px] px-5 pt-10 pb-20 sm:px-8"
        >
          <SettingsPageHeading />
          <SettingsLayout sidebar={<SettingsSidebar />}>
            <UsersPane />
          </SettingsLayout>
        </main>
      </UsersShell>
    </UsersProvider>
  );
}