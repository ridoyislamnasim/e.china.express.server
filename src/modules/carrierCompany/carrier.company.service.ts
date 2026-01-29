
import CarrierCompanyPayload from '../../types/carrierCompany.type';
import carrierCompanyRepository, { CarrierCompanyRepository } from './carrier.company.repository';
import ImgUploader from '../../middleware/upload/ImgUploder';
// import { CarrierCompanyPayload } from '../../types/carrierCompany.type';


export class CarrierCompanyService {
  private repository: CarrierCompanyRepository;
  // private roleRepository: RoleRepository;

  constructor(repository: CarrierCompanyRepository = carrierCompanyRepository) {
    this.repository = repository;
  }

  
  async createCarrierCompany(payload: CarrierCompanyPayload, files?: any): Promise<any> {
    const { name, shortName, code, carrierType, scacCode, iataCode, icaoCode, logoUrl, description, status } = payload;

    // Validate required fields make this more robust later
    if (!name || !carrierType) {
      const error = new Error('CarrierCompany name and carrierType are required');
      (error as any).statusCode = 400;
      throw error;
    }

    // If files are provided (multipart/form-data), upload and set logoUrl
    let finalLogoUrl = logoUrl;
    if (files && files.length) {
      const images = await ImgUploader(files);
      // take first uploaded image value
      for (const key in images) {
        finalLogoUrl = images[key];
        break;
      }
    }

    const carrierCompanyPayload: CarrierCompanyPayload = {
      name,
      shortName,
      code,
      carrierType,
      scacCode,
      iataCode,
      icaoCode,
      logoUrl: finalLogoUrl,
      description,
      status
    };

    const carrierCompany = await this.repository.createCarrierCompany(carrierCompanyPayload);
    return carrierCompany;
  }

  async updateCarrierCompany(id: number, payload: CarrierCompanyPayload, tx: any): Promise<any> {
    const { name, shortName, code, carrierType, scacCode, iataCode, icaoCode, logoUrl, description, status } = payload;

    const carrierCompanyPayload: CarrierCompanyPayload = {
      name,
      shortName,
      code,
      carrierType,
      scacCode,
      iataCode,
      icaoCode,
      logoUrl,
      description,
      status
    };
    const updatedCarrierCompany = await this.repository.updateCarrierCompany(id, carrierCompanyPayload, tx);


    return updatedCarrierCompany;
  }
    


  async getAllCarrierCompanys(payload?: any){
    const carrierCompanys = await this.repository.getAllCarrierCompanys();
    console.log("Fetched CarrierCompanys: ", carrierCompanys);
    return carrierCompanys;
  }

  async getCarrierCompanyWithPagination(payload: { page: number; limit: number }, tx: any): Promise<any> {
    const { page, limit } = payload;
    const offset = (page - 1) * limit;
    const countries = await this.repository.getCarrierCompanyWithPagination({ limit, offset }, tx);
    return countries;
  }


  async getCarrierCompanyById(id: number): Promise<any> {
    const carrierCompany = await this.repository.getCarrierCompanyById(id);
    return carrierCompany;
  }

  async deleteCarrierCompany(id: number): Promise<void> {
    // find the carrierCompany first
    const carrierCompany = await this.repository.getCarrierCompanyById(id);
    if (!carrierCompany) {
      const error = new Error('CarrierCompany not found');
      (error as any).statusCode = 404;
      throw error;
    }
    // then delete ports associated with the carrierCompany
    
   return  await this.repository.deleteCarrierCompany(id);
  }

}

