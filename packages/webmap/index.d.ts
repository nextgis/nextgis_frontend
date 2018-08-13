import { WebMap } from './src/entities/WebMap';
import { AppOptions } from './src/interfaces/WebMapApp';
export declare function buildWebMap(opt: AppOptions): Promise<WebMap>;
declare global {
    interface Window {
        WebMap: WebMap;
        buildWebMap: (config: any) => Promise<WebMap>;
    }
}
