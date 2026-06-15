import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { NewUserPayload } from "./userData";

type AddUserDialogProps = {
  onAddUser: (payload: NewUserPayload) => Promise<void> | void;
};

/**
 * AddUserDialog
 * -----------------------------------------------------------------------------
 * Invite-user modal with name, email, and role fields.
 * -----------------------------------------------------------------------------
 */
export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset_form = () => {
    setName("");
    setEmail("");
    setRole("member");
    setErrorMessage(null);
  };

  const handle_open_change = (next_open: boolean) => {
    if (isSubmitting) {
      return;
    }

    setOpen(next_open);
    if (!next_open) {
      reset_form();
    }
  };

  const handle_submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onAddUser({
        name: name.trim(),
        email: email.trim(),
        role,
      });
      handle_open_change(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Unable to send invite. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handle_open_change}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="h-9 rounded-full border-[#ECECEC] bg-white px-4 text-[13px] font-semibold text-[#1A1A1A] hover:bg-[#FAFAFA] hover:border-[#BEBEBE]"
        >
          <Plus className="h-3.5 w-3.5 text-[#FF6A5B]" />
          Add user
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[460px]" showCloseButton>
        <DialogHeader>
          <DialogTitle>Invite a user</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a sign-in link for this workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handle_submit}>
          <div className="space-y-2">
            <Label htmlFor="user-name">Full name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Maya Lindgren"
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Work email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="maya@yourcompany.com"
              autoComplete="off"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "admin" | "member")}
              disabled={isSubmitting}
            >
              <SelectTrigger id="user-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  Admin — manage settings, billing, and team
                </SelectItem>
                <SelectItem value="member">
                  Member — manage orders and upsells
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {errorMessage ? (
            <p className="text-sm text-[#B0352E]">{errorMessage}</p>
          ) : null}

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => handle_open_change(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0D2743] text-white hover:bg-[#153657]">
              {isSubmitting ? "Sending invite..." : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
