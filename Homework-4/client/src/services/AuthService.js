import $api from "../http";

export default class AuthService {
    static async login(username, password) {
        return $api.post('/auth/login', { username, password })
    }

    static async registration(username, password) {
        return $api.post('/auth/registration', { username, password })
    }

    static async logout() {
        return $api.post('/auth/logout')
    }

}