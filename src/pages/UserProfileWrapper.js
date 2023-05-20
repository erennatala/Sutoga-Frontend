import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";

export default function UserProfileWrapper() {
    const [key, setKey] = useState(Math.random());

    useEffect(() => {
        setKey(Math.random());
    }, [window.location.pathname]);

    return <UserProfile key={key} />;
}