type loginRequest = {
    identifier: string
    password: string
}

type loginResponse = {
    accessToken: string
    refreshToken: string
    role: string
    claims: {
        authority: string
    }
}

export type { loginRequest, loginResponse }