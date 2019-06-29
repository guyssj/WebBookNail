export enum typeMessage{
    Success,
    Error
}
export interface MessageConfig{
    message:string,
    type?:typeMessage
}