export interface FoundPicture {
  name: string;
  path: string;
  score: number;
}

export interface SearchPicturesRequest {
  name: string;
}

export interface SearchPicturesResponse {
  pictures: FoundPicture[];
}

export interface DeletePictureRequest {
  path: string;
}

export interface DeletePictureResponse {
  deletedFromDisk: boolean;
  deletedFromDatabase: boolean;
}

export interface UploadPictureRequest {
  file?: Express.Multer.File;
  name: string;
}

export interface UploadPictureResponse {
  picture: {
    picture_id: string;
    createdAt: Date;
    name: string;
    path: string;
  };
}
