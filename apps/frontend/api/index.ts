import { HTTP_BACKEND } from "@/config";
import axios, { AxiosResponse } from "axios";

export const handleAuthSubmit = async (isLogIn: boolean, username: string, password: string) => {
    let redirectTo = '';
    let token = '';
    let error = false;

    if(username && password) {
        let response: AxiosResponse;
        try {
            switch (isLogIn) {
                case false:
                    response = await axios.post(`${HTTP_BACKEND}/signup`, {
                        username: username,
                        password: password,
                        name: username
                    })
                    if(response.data.message) {
                        console.error(response.data.message)
                    }
                    console.log(response.data);
                    redirectTo = 'signin';
                    break;
            
                case true:
                    response = await axios.post(`${HTTP_BACKEND}/signin`, {
                        username: username,
                        password: password
                    })
                    if(response.data.message) {
                        console.error(response.data.message)
                    }
                    if(!response.data || !response.data.token) {
                        error = true;
                        return { redirectTo, token, error }; 
                    }
                    console.log(response.data);
                    token = response.data.token;
                    redirectTo = 'dashboard';
                    break;

                default:
                    break;
            }
        } catch(error) {
            console.error('Error while auth '+error);
        }
        
    } else {
        alert('Please enter your username and password to proceed.');
        error = true;
    }
    return { redirectTo, token, error }

}