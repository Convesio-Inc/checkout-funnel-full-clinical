/**
 * SettingsPageHeading
 * -----------------------------------------------------------------------------
 * Static heading block for settings screens.
 * -----------------------------------------------------------------------------
 */
export function SettingsPageHeading() {
  return (
    <section
      data-section="settings-heading"
      className="mb-7 flex items-end justify-between gap-5"
    >
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#7A7A7A] uppercase">
          Account
        </p>
        <h1 className="text-[clamp(32px,3.5vw,44px)] leading-[1.05] font-extrabold tracking-[-0.025em] text-[#1A1A1A]">
          Settings
        </h1>
      </div>
    </section>
  );
}
