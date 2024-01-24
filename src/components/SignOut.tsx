import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function SignOut() {
    const navigate = useNavigate();
    
    useEffect(() => {
        function onSignOut() {
            Cookies.remove('jwtToken');
            localStorage.removeItem('username');
            navigate('/');
        }

        onSignOut();
    }, [navigate]);

    return null;
}
