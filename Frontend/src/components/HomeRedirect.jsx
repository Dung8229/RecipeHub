import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/home');
    }, [navigate]);

    return null; // Không cần hiển thị gì vì sẽ tự động chuyển hướng
}

export default HomeRedirect;