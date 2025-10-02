import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HostKYC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/host/kyc-submission', { replace: true });
  }, [navigate]);

  return null;
};