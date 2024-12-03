export interface ChatJoin {
    joined: boolean,
    uuid?: string
}

export interface MessagesRead {
    messages: number[],
}
