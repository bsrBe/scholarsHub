import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, User as UserIcon, LogOut } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to view your profile.</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.profileImageUrl} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.role === 'admin' && (
            <span className="mt-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Administrator
            </span>
          )}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your personal account details and information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Be careful with these actions as they cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="text-destructive border-destructive/50 hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
