import { useNavigate } from 'react-router';

export default function FourOhFour() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/forum');
    };

    return (
        <div>
            <h1>404</h1>
            <h2>Page not found</h2>
            <button onClick={goToHome}>Go to Home</button>
        </div>
    );
}
