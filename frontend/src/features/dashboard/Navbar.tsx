// src/features/dashboard/Navbar.tsx
import { useAuth } from '../auth/AuthContext';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get user initials for the avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('');
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold">Job Tracker</h1>
                <nav className="flex items-center gap-4 text-sm">
                    <Link to="/dashboard" className={cn("transition-colors hover:text-foreground", location.pathname === '/dashboard' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                        Pipeline
                    </Link>
                    <Link to="/dashboard/analytics" className={cn("transition-colors hover:text-foreground", location.pathname === '/dashboard/analytics' ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                        Analytics
                    </Link>
                </nav>
            </div>
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
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
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </header>
    );
};

export default Navbar;