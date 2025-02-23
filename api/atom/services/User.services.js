import { async } from "@babel/runtime/regenerator";
import Users from "../models/Users";
import boom from "@hapi/boom";

//DEvuelve la lista de usuarios
export const getUsersList = async () => {
    let userList;
    try{
        userList = await Users.find();
        return (userList);
    }catch(error){
        throw boom.internal(error);
    }
} 