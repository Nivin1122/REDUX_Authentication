import React, { useEffect, useState } from 'react';
import api from '../api';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 
    const [updatedProfile, setUpdatedProfile] = useState({
        username: '',
        email: '',
        bio: '',
        profile_picture: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/user/profile/');
                setProfile(response.data);
                setUpdatedProfile({
                    username: response.data.username || '',
                    email: response.data.email || '',
                    bio: response.data.bio || '',
                    profile_picture: response.data.profile_picture || '',
                });
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.detail || 'Error fetching profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(updatedProfile); 
    
        const token = localStorage.getItem('access_token');
    
        try {
            
            const response = await api.put('/users/user/profile/update/', updatedProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
           
            setProfile(response.data);  
            setIsEditing(false);       
            setError(null);             
        } catch (err) {
            
            setError(err.response?.data?.detail || 'Error updating profile');
        }
    };
    

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

            <button onClick={handleEditClick}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>

            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={updatedProfile.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={updatedProfile.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div> */}
                    {/* <div>
                        <label>Bio:</label>
                        <textarea
                            name="bio"
                            value={updatedProfile.bio}
                            onChange={handleInputChange}
                        />
                    </div> */}
                    {/* <div>
                        <label>Profile Picture URL:</label>
                        <input
                            type="text"
                            name="profile_picture"
                            value={updatedProfile.profile_picture}
                            onChange={handleInputChange}
                        />
                    </div> */}
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default UserProfile;
