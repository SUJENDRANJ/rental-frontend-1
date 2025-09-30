import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, Building } from 'lucide-react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Badge } from './badge';
import { AuthModal } from '../auth/AuthModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { switchRole } from '../../store/slices/authSlice';
import type { User } from '../../store/slices/authSlice';

export const RoleSwitcher = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleRoleSwitch = (newRole: 'renter' | 'host') => {
    if (!isAuthenticated) {
      setAuthMode(newRole === 'host' ? 'signup' : 'login');
      setIsAuthModalOpen(true);
      return;
    }

    if (newRole === 'host' && user?.role === 'renter') {
      // Redirect to KYC process for becoming a host
      navigate('/host/kyc');
      return;
    }

    dispatch(switchRole(newRole));
    
    // Navigate to appropriate dashboard
    if (newRole === 'host') {
      navigate('/host/dashboard');
    } else {
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Join as
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleRoleSwitch('renter')}>
              <UserCheck className="h-4 w-4 mr-2" />
              Renter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSwitch('host')}>
              <Building className="h-4 w-4 mr-2" />
              Host
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {user?.role === 'host' ? (
            <Building className="h-4 w-4" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          <span className="capitalize">{user?.role}</span>
          <Badge variant="secondary" className="ml-1">
            Switch
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('renter')}
          disabled={user?.role === 'renter'}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Renter
          {user?.role === 'renter' && <Badge variant="default" className="ml-2">Current</Badge>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('host')}
          disabled={user?.role === 'host'}
        >
          <Building className="h-4 w-4 mr-2" />
          Host
          {user?.role === 'host' && <Badge variant="default" className="ml-2">Current</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};