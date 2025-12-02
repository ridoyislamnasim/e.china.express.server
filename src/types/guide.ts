export interface GuideVideo {
  id: number;
  guideId: number;             // FK
  guidSerial: number;             // reference to Guide.id (probably duplicate)
  videoUrl: string;
  videoTitle?: string;
  thumbnailImage?: string;     // fixed spelling: thamnailImage -> thumbnailImage
  videoShortDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface Guide {
  id: number;
  title: string;
  slug:string;
  serial: number;
  videos: GuideVideo[]; 
  createdAt: Date;
  updatedAt: Date;
}


export interface GuideRequestDTO {
  id?: number;
  title: string;
  videoUrl: string;
  videoTitle?: string;
  thumbnailImage?: string;
  videoShortDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}




