import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, FileText, Video, ClipboardList } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formService } from "@/services/formService";
import { taskApplicationService } from "@/services/taskApplicationService";

export default function NavUser() {
  const { user, logout } = useAuth();

  const { data: userForms } = useQuery({
    queryKey: ['user-forms'],
    queryFn: () => formService.getMyForms(),
    enabled: !!user,
  });

  const { data: userTasks } = useQuery({
    queryKey: ['user-task-applications'],
    queryFn: () => taskApplicationService.getMyTaskApplications(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex space-x-2">
        <Button variant="outline" asChild>
          <Link to="/auth/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/auth/register">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  const hasUnread =
    userForms?.some(f => f.isRead === false) ||
    userTasks?.some(t => t.isRead === false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImageUrl} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/my-applications" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            <span className="flex items-center">
              My Applications
              {hasUnread && (
                <span className="ml-2 h-2 w-2 rounded-full bg-red-600" />
              )}
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tasks" className="w-full">
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/book-consultation" className="w-full">
            <Video className="mr-2 h-4 w-4" />
            <span>My Scheduled Consultations</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
