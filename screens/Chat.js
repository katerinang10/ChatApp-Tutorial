import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react';

import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

import { GiftedChat } from "react-native-gifted-chat";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';

/* importing from other files in project */
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

export default function Chat() {
    const [messages, setMessages] = useState([]);       // creating messages array
    const navigation = useNavigation();                 // initializing navigation hook

    // function for when signing out
    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
    };

    // button for signout after login
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{
                        marginRight: 10
                    }}
                    onPress={onSignOut}
                >
                    <AntDesign name="logout" size={24} color={colors.black} style={{marginRight: 10}}/>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('snapshot');
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    return (
        // adjust view for any keyboard
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-80}
        >
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    avatar: 'https://i.pravatar.cc/300'
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}

                keyboardShouldPersistTaps="handled"
                bottomOffset={Platform.OS === "ios" ? 40 : 0}
            />
        </KeyboardAvoidingView>
    );
}