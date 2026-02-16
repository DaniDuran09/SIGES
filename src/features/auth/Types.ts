type loginRequest = {
    identifier: string
    password: string
}

type loginResponse = {
    token: string
    refreshToken: string
}

export { loginRequest, loginResponse }