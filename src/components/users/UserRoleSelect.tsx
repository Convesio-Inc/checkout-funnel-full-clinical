import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRoleSelectProps = {
  value: "admin" | "member";
  onValueChange: (value: "admin" | "member") => void;
};

/**
 * UserRoleSelect
 * -----------------------------------------------------------------------------
 * Editable role selector for non-owner users.
 * -----------------------------------------------------------------------------
 */
export function UserRoleSelect({ value, onValueChange }: UserRoleSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onValueChange(next as "admin" | "member")}>
      <SelectTrigger className="h-7 rounded-full border-[#ECECEC] bg-white px-2.5 text-xs font-semibold text-[#1A1A1A] hover:border-[#BEBEBE] focus-visible:border-[#0D2743] focus-visible:ring-[3px] focus-visible:ring-[#0D2743]/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
}
