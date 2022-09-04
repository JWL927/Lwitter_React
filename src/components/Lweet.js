import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "../fbase";
import { deleteObject, ref } from "firebase/storage";
import { storageService } from "../fbase";

const Lweet = ({lweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newLweet, setNewLweet] = useState(lweetObj.text);
    const desertRef = ref(storageService, lweetObj.attachmentUrl);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this lweet?");
        if(ok) {
            const LweetTextRef = doc(dbService, "lweets", `${lweetObj.id}`);
            await deleteDoc(LweetTextRef);
            if (lweetObj.attachmentUrl !== "") {
                await deleteObject(desertRef);
            }
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        const LweetTextRef = doc(dbService, "lweets", `${lweetObj.id}`);
        await updateDoc(LweetTextRef, {
            text: newLweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {target: {value},} = event;
        setNewLweet(value);
    }
    return (
        <div>
            {
                editing ? (
                    <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Edit your lweet" onChange={onChange} value={newLweet} required />
                        <input type="submit" value="Update Lweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                    <h4>{lweetObj.text}</h4>
                    {lweetObj.attachmentUrl && <img src={lweetObj.attachmentUrl} width="50px" height="50px"/>}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Lweet</button>
                            <button onClick={toggleEditing}>Edit Lweet</button>
                        </>
                    )}
                    </>
                )
            }
        </div>      
    );
}

export default Lweet;