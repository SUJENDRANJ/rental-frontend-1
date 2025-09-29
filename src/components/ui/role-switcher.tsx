import { useState } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { switchRole, logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleRoleSwitch = (newRole: 'renter' | 'host') => {
    dispatch(switchRole(newRole));
    
    // Navigate to appropriate page based on role
    if (newRole === 'host') {
      navigate('/host/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Badge variant={user.role === 'host' ? 'default' : 'secondary'}>
            {user.role === 'host' ? 'Host' : 'Renter'}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('renter')}
          disabled={user.role === 'renter'}
        >
          Switch to Renter
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('host')}
          disabled={user.role === 'host'}
        >
          Switch to Host
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};