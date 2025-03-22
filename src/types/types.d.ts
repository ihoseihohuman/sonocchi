// types/types.d.ts

declare module '*.json' {
    const value: any;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}
