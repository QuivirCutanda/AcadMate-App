import { useEffect, useState } from "react";
import {getAllUsers} from "@/src/database/userQueries";

interface getAllUserProps{
    firstname:string,
    lastname: string,
    email: string,
    profile_pic: string | null,
}      
      
     export const useUserInfo = async () => {
        const [userData, setUserData] = useState<getAllUserProps>({
          firstname: "",
          lastname: "",
          email: "",
          profile_pic: null as string | null,
        });
        try {
          const users:any = await getAllUsers();
          if (users && users.length > 0) {
            setUserData({
              firstname: users[0].firstname || "",
              lastname: users[0].lastname || "",
              email: users[0].email || "",
              profile_pic: users[0].profilePic || null,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        return userData;
      };
    
