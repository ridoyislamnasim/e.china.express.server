export interface GuideVideo {
  id: number;
  guideId: number; // FK
  guidSerial: number; // reference to Guide.id (probably duplicate)
  videoUrl: string;
  videoTitle?: string;
  thumbnailImage?: string; // fixed spelling: thamnailImage -> thumbnailImage
  videoShortDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guide {
  id: number;
  title: string;
  slug: string;
  serial: number;
  videos: GuideVideo[];
  createdAt: Date;
  updatedAt: Date;
}








// For creating a GuideVideo
export interface CreateGuideVideoDTO {
  url: string;
  imgSrc?: string;
  videoLength?: string;
  title?: string;
  shortDes?: string;
  videoSerial: number;
}

// For updating a GuideVideo
export interface UpdateGuideVideoDTO {
  url?: string;
  imgSrc?: string;
  videoLength?: string;
  title?: string;
  shortDes?: string;
  videoSerial?: number;
}

// For returning GuideVideo in responses
export interface GuideVideoResponseDTO {
  id: number;
  guideId: number;
  url: string;
  imgSrc?: string;
  videoLength?: string;
  title?: string;
  shortDes?: string;
  videoSerial: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a Guide with videos
export interface CreateGuideDTO {
  serial: number;
  title: string;
  videos?: CreateGuideVideoDTO[];
}

// For updating a Guide (partial update)
export interface UpdateGuideDTO {
  serial?: number;
  title?: string;
  videos?: UpdateGuideVideoDTO[];
}

// For returning Guide in responses
export interface GuideResponseDTO {
  id: number;
  serial: number;
  title: string;
  videos: GuideVideoResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}
