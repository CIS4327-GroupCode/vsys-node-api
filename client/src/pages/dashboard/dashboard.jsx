import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AvailableOpportunities } from '../../components/opportunities/availableOpp';
import { MyOpportunities } from '../../components/opportunities/myOpps';
import { OpportunitiesManager } from '../../components/opportunities/oppsManager';

//API call to get user info based on JWT
async function fetchUserInfo(token) {
    const decoder = jwtDecode(token);
    const response = await fetch(`http://localhost:3000/api/users/${decoder.username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
}
 
//case:admin
function AdminDashboard({ user }) {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user} (Admin)</p>
            <OpportunitiesManager/>
        </div>
    );
}

//case:user
function UserDashboard({ user }) {
    //console.log('Rendering UserDashboard with user:', user);
    return (
        <div>
            <h2>User Dashboard</h2>
            <p>Welcome, {user}</p>

            <AvailableOpportunities />
            <MyOpportunities userId={user} />
            <button onClick={() => window.location.reload()}>Refresh Opportunities</button>
            <button onClick={() => {
                localStorage.removeItem("token")
                window.location.href = '/login'
                }}>log out</button>
        </div>
    );
}


export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //getting token from localStorage or useNavigate state
        const token = localStorage.getItem('token') || location.state?.token;
        
        if (!token) {//is there a token to use?
            navigate('/login');
            return;
        }

        //check for token expiration
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                window.alert('Your session has expired. Please log in again.');
                setLoading(false);
                navigate('/login');
                return;
            }
        } catch (err) {
            console.error('Invalid token:', err);
            localStorage.removeItem('token');
            window.alert('Invalid session. Please log in again.');
            setLoading(false);
            navigate('/login');
            return;
        }

    
        fetchUserInfo(token)
            .then((data) => {
                //console.log('Fetched user data:', data.type_id);
                setUser(data.username);
                let rol = '';
                data.type_id===1? rol='user': rol='admin';
                setRole(rol);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch user info', err);
                localStorage.removeItem('token');
                window.alert('Failed to fetch user info. Please log in again.');
                setLoading(false);
                navigate('/login');
                return;
            });
    }, [location, navigate]);

    if (loading) return <div>Loading...</div>;

    // Base template
    return (
        <div>
            <header>
                <h1>Dashboard</h1>
            </header>
            <main>
                {role === 'admin' && <AdminDashboard user={user} />}
                {role === 'user' && <UserDashboard user={user} />}
                {role !== 'admin' && role !== 'user' && (
                    <div>
                        <h2>Access Denied</h2>
                        <p>looks like you don't have an account with us. Register <a onClick={() => navigate('/register')}>HERE</a> to have access tou your own dashboard</p>
                    </div>
                )}
            </main>
        </div>
    );
}
