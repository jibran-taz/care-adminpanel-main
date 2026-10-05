
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth';
import makeApiRequest from '@/services/axios';
import { apiUrl } from '@/services/api-end-point';
import { notify } from '@/utils/utils';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const { user } = useAuth();
const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        const response = await makeApiRequest(apiUrl.logOut, {
          method: 'POST',
        });
        console.log('🚪 Logout Response:', response);
        if(response.success === true) {
          notify({ message: response.message, type: 'success' });
          navigate('/');
        }
        // You might want to add additional logout handling here
      } catch (error) {
        console.error('❌ Logout Error:', error);
      }
    }
  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          {/* <p className="text-muted-foreground">Welcome back, Admin!</p> */}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Order #1234 completed</p>
                  <p className="text-sm text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">System maintenance scheduled</p>
                  <p className="text-sm text-muted-foreground">3 hours ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {/* <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600" /> */}
                <img src="https://avatars.githubusercontent.com/u/124599?v=4" className='w-10 rounded-full' alt="" />
                <span className="hidden md:block">{user?.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
