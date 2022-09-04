import React, { useEffect } from 'react';
import { authService } from '../fbase';
import {useNavigate} from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Profile = ({userObj}) => {
    const navigate = useNavigate();
    const onLogoutClick = () => {
        authService.signOut();
        navigate('/', {replace: true});
    };
    const getMyLweets = async () => {
        const q = query(collection(dbService, "lweets"),where("creatorId", "==", userObj.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        });
    };

    useEffect(() => {
        getMyLweets();
    }, []);

    return (
        <>
            <span>Profile</span>
            <button onClick={onLogoutClick}>Logout</button>
        </>
        
        
    );
};

export default Profile;