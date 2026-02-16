import { useState } from 'react';
import { loginRequest, loginResponse } from '../Types';

function Login() {

    const [response, setResponse] = useState<loginResponse>();
    const [request, setRequest] = useState<loginRequest>();

    return (
        <>
        </>
    )
}

export default Login;