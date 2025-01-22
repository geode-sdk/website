export interface ServerDeveloper {
    id: number;
    username: string;
    display_name: string;
    verified: boolean;
    admin: boolean;
    github_id: number;
}

export interface ServerTag {
    id: number;
    name: string;
    display_name: string;
    is_readonly: boolean;
}
