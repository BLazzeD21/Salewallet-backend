import type {
  DeletePictureRequest,
  DeletePictureResponse,
  SearchPicturesRequest,
  SearchPicturesResponse,
  UploadPictureRequest,
  UploadPictureResponse,
} from "@/types";

import { deletePicture } from "./deletePicture.service";
import { searchPictures } from "./searchPictures.service";
import { uploadPicture } from "./uploadPicture.service";

class PictureService {
  search!: (request: SearchPicturesRequest) => Promise<SearchPicturesResponse>;
  delete!: (request: DeletePictureRequest) => Promise<DeletePictureResponse>;
  upload!: (request: UploadPictureRequest) => Promise<UploadPictureResponse>;
}

PictureService.prototype.search = searchPictures;
PictureService.prototype.delete = deletePicture;
PictureService.prototype.upload = uploadPicture;

export { PictureService };
