import type { FileMeta, IdOnly } from '@nextgis/ngw-connector';
import type { GetNgwItemOptions } from '../interfaces';

export interface UploadFeatureAttachmentOptions {
  file: File;
}

export function uploadFeatureAttachment(
  options: GetNgwItemOptions & UploadFeatureAttachmentOptions,
): IdOnly {
  return options.connector
    .post('file_upload.upload', {
      file: options.file,
    })
    .then((resp) => {
      const fileMeta = resp.upload_meta[0];
      return addFeatureAttachment({ ...options, fileMeta });
    });
}

export function addFeatureAttachment(
  options: GetNgwItemOptions & { fileMeta: FileMeta },
): IdOnly {
  const meta = options.fileMeta;
  return options.connector.post(
    'feature_attachment.collection',
    {
      data: {
        name: meta.name,
        size: meta.size,
        mime_type: meta.mime_type,
        file_upload: {
          id: meta.id,
          size: meta.size,
        },
      },
    },
    { id: options.resourceId, fid: options.featureId },
  );
}
