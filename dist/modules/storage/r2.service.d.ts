import { File as MulterFile } from 'multer';
export declare class R2Service {
    private s3;
    private bucketName;
    constructor();
    uploadFile(file: MulterFile, key: string): Promise<string>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
