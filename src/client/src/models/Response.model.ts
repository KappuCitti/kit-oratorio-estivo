export type Response<T> =  ResponseSuccess<T> | ResponseError | RequestErrror;

interface ResponseError {
    error: string
    success?: boolean

    data: undefined
}

interface RequestErrror {
    error: string[]
    success: false

    data: undefined
}

interface ResponseSuccess<T> {
    error?: string
    
    success: boolean
    data: T
}