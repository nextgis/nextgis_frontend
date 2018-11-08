import NgwUploader, { AvailableStatus } from './ngw-uploader';
export declare function evented(options?: {
    status: AvailableStatus;
    template?: string;
}): (target: NgwUploader, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
