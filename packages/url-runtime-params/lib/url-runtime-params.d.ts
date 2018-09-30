export declare class UrlParams {
    private _params;
    getParam(name: string): any;
    getParams(): {
        [paramName: string]: any;
    };
    setParam(name: any, value: any): {
        state: {
            url: any;
            params: {};
        };
        url: any;
    } | {
        state: {
            url: string;
            type: string;
        };
        url: string;
    };
    removeParam(name: string): {
        state: {
            url: string;
            type: string;
        };
        url: string;
    };
    private _pushState;
}
