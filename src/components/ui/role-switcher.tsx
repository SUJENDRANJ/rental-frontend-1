import { Users, Chrome as Home } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { switchRole, logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return null;

  const handleRoleSwitch = () => {
    const newRole = user.role === 'renter' ? 'host' : 'renter';
    dispatch(switchRole(newRole));
    
    // Navigate to appropriate page based on role
    if (newRole === 'host') {
      navigate('/host/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={user.role === 'host' ? 'default' : 'secondary'}>
        {user.role === 'host' ? 'Hosting' : 'Renting'}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRoleSwitch}
        className="h-8 px-2"
      >
        {user.role === 'renter' ? (
          <Home className="h-4 w-4 mr-1" />
        ) : (
          <Users className="h-4 w-4 mr-1" />
        )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            Logout
          </DropdownMenuItem>
        Switch to {user.role === 'renter' ? 'Host' : 'Rent'}
      </Button>
    </div>
  );
};