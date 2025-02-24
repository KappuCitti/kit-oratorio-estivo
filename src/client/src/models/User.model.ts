export default interface User {
    id: number
    name: string
    surname: string
    email: any
    theme: string
    roles: Role[]
    permissions: Permission[]
}

export interface Role {
    id: number
    name: string
}

export interface Permission {
    id: number
    name: string
}