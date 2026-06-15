/**
 * LoginBrandMark
 * -----------------------------------------------------------------------------
 * Visual brand tile shown above the login heading with the Convesio hex mark.
 * -----------------------------------------------------------------------------
 */

export function LoginBrandMark() {
  return (
    <div
      data-section="login-brand-mark"
      className="relative mx-auto mb-7 grid h-16 w-16 place-items-center rounded-[18px] border border-[#ECECEC] bg-white shadow-[0_1px_2px_rgba(13,39,67,0.06),0_8px_20px_rgba(13,39,67,0.06)]"
    >
      <span
        aria-hidden="true"
        className="absolute -inset-1.5 rounded-[22px] border border-dashed border-[#FF6A5B]/25 animate-pulse"
      />
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="19.745 0 30.3 35" fill="none">
        <path d="m34.895.001-15.15 8.761V26.24L34.895 35l15.15-8.761V8.762zm7.666 11.864-7.666 4.336-7.575-4.381 7.575-4.381zM26.407 13.28l7.621 4.426v8.899l-7.62-4.427zm9.355 13.325v-8.899l7.62-4.426v8.898z" fill="#ff6a5b" />
      </svg>
    </div>
  );
}
