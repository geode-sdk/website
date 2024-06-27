export interface ServerDeveloper {
    id: number;
    username: string;
    display_name: string;
    verified: boolean;
    admin: boolean;
}

export interface ServerModDeveloper {
    id: number;
    username: string;
    display_name: string;
    is_owner: boolean;
}

export interface GithubLogin {
    uuid: string;
    interval: number;
    uri: string;
    code: string;
}