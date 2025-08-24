import type { BlobFetchable } from '@/types/service/blob-fetchable.interface';
import type { Destroyable } from '@/types/service/destroyable.interface';
import type { Fetchable } from '@/types/service/fetchable.interface';
import type { FormDataConvertible } from '@/types/service/form-data-convertible.interface';
import type { Postable } from '@/types/service/postable.interface';
import type { Putable } from '@/types/service/putable.interface';

export interface BaseApiClientInterface
    extends BlobFetchable,
        Fetchable,
        Postable,
        Putable,
        Destroyable,
        FormDataConvertible {}
