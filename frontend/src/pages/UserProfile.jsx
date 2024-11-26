import React, { useEffect, useState } from 'react';
// import api from '../api'; 
import api from '../api';
const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/user/profile/');
                console.log('Profile Response:', response.data);
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Profile Fetch Error:', err);
                setError(err.response?.data?.detail || 'Error fetching profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome, {profile?.username || 'User'}!</h1>
            {profile?.profile_picture ? (
                <img
                    src={profile.profile_picture}
                    alt="Profile"
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        marginBottom: '10px',
                    }}
                />
            ) : (
                <div>No Profile Picture</div>
            )}
            <p><strong>Email:</strong> {profile?.email || 'N/A'}</p>
            <p><strong>Bio:</strong> {profile?.bio || 'No bio provided'}</p>
        </div>
    );
};

export default UserProfile;