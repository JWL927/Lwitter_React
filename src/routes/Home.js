import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import {collection, addDoc, query, onSnapshot, orderBy} from "firebase/firestore";
import Lweet from '../components/Lweet';
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { storageService } from '../fbase';
import { v4 } from "uuid";

const Home = ({userObj}) => {
    const [lweet, setLweet] = useState("");
    const [lweets, setLweets] = useState([]);
    const [attachment, setAttachment] = useState();
    useEffect(() => {
        const q = query(collection(dbService, "lweets"),orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const lweetArr = snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
        }));
            setLweets(lweetArr);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment != ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
        }
        try {
            await addDoc(collection(dbService, "lweets"),{
                text: lweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setLweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target:{value}} = event;
        setLweet(value);
    };
    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result},} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);
    return (
        <>
            <form onSubmit={onSubmit}>
                <input value={lweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Lweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {lweets.map((lweet) => (
                    <Lweet key={lweet.id} lweetObj={lweet} isOwner={lweet.creatorId === userObj.uid} />
                ))}
            </div>
        </>
    );
};

export default Home;