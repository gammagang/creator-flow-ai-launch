import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name =
    (user?.identities?.[0]?.identity_data?.contact_name as string) ||
    user?.user_metadata?.name ||
    "User";

  const email = user?.email || user?.user_metadata?.email || "";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
        return;
      }
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  return (
    <header className="h-16 backdrop-blur-md bg-white/70 border-b border-orange-200 shadow-[0_2px_8px_0_rgba(255,183,77,0.08)] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="bg-gradient-to-br from-orange-100 to-pink-100 shadow-[2px_2px_0px_0px_#fbbf24] hover:shadow-[4px_4px_0px_0px_#fbbf24] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200" />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="ring-2 ring-orange-200 shadow-[2px_2px_0px_0px_#fbbf24] hover:shadow-[4px_4px_0px_0px_#fbbf24] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              {/* If you have a user image, use AvatarImage. Otherwise, fallback to initials. */}
              {user?.user_metadata?.avatar_url ? (
                <AvatarImage src={user.user_metadata.avatar_url} alt={name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 font-bold">
                  {name?.[0] || "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-2xl border-0 bg-white/90 backdrop-blur-xl shadow-[0_2px_8px_0_rgba(251,191,36,0.10)] p-4 mt-2"
          >
            <DropdownMenuLabel className="p-0 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-orange-200">
                  {user?.user_metadata?.avatar_url ? (
                    <AvatarImage
                      src={user.user_metadata.avatar_url}
                      alt={name}
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-orange-200 to-pink-200 text-orange-700 font-bold">
                      {name?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">
                    {name}
                  </span>
                  <span className="text-xs text-gray-500">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-3 bg-orange-100" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-4 py-2 text-orange-700 font-medium hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4 text-orange-400" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
