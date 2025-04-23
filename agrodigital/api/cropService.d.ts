import { AxiosResponse } from 'axios';

export interface Crop {
    cropId?: string;
    userId: string;
    name: string;
    cropType: string;
    plantDate: string;
    location: string;
    area: number;
    status: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CropService {
    getUserCrops: (userId: string) => Promise<AxiosResponse<Crop[]>>;
    getCrop: (cropId: string) => Promise<AxiosResponse<Crop>>;
    createCrop: (cropData: Crop) => Promise<AxiosResponse<Crop>>;
    updateCrop: (cropId: string, cropData: Partial<Crop>) => Promise<AxiosResponse<Crop>>;
    deleteCrop: (cropId: string) => Promise<AxiosResponse<{ message: string }>>;
    getCropsByType: (cropType: string) => Promise<AxiosResponse<Crop[]>>;
}

export const cropService: CropService; 