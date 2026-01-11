import { CompanyContacts, ContactMessage } from "../../types/contact-us.interface";
import CompanyContactsRepository from "./companyContact.repository";

class CompanyContactService {
  private contactUsRepository = new CompanyContactsRepository();

  async createCompanyContact(payload: CompanyContacts) {
    payload.email = payload.email.toLowerCase().trim();
    payload.facebook = payload.facebook?.toLowerCase().trim();
    payload.twitter = payload.twitter?.toLowerCase().trim();
    payload.linkedin = payload.linkedin?.toLowerCase().trim();
    payload.instagram = payload.instagram?.toLowerCase().trim();
    payload.phones = payload.phones?.map((phone) => phone.trim());
    payload.emergencyHotlines = payload.emergencyHotlines?.map((hotline) => hotline.trim());

    const result = await await this.contactUsRepository.createCompanyContactRepo(payload);

    return result;
  }

  async createContactUsRequest(payload: ContactMessage) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]+$/;

    const normalizedPayload = {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone?.trim() || "",
      subject: payload.subject?.trim() || "",
      message: payload.message.trim(),
      createdAt: payload.createdAt || new Date().toISOString(),
    };
    
    if (!emailRegex.test(normalizedPayload.email)) {
      throw new Error("Please enter a correct email.")
    }

    if (normalizedPayload.phone && !phoneRegex.test(normalizedPayload.phone)) {
      throw new Error("Please enter a valid phone number.");
    }

    normalizedPayload.phone = normalizedPayload.phone.replace(/-/g, "");

    const savedRequest = await this.contactUsRepository.createContactUsRequestRepo(normalizedPayload as ContactMessage);

    return savedRequest;
  }

  async getAllContactRequestsService(page: number, limit: number) {
    return await this.contactUsRepository.getAllContactRequestsRepo({ page, limit });
  }




  
  async getSingleContactRequestByIdService(id: string) {
    if (!id) {
      throw new Error("Request Unavailable.");
    }

    const contact = await this.contactUsRepository.getContactByIdRepo(id);

    if (!contact) {
      throw new Error("Contact request not found");
    }

    return {
      statusCode: 200,
      success: true,
      message: "Contact request fetched successfully",
      data: contact,
    };
  }


  async markContactAsCheckedService(id: string) {
  if (!id) {
    throw new Error("Contact ID is required");
  }

  const contact = await this.contactUsRepository.getContactByIdRepo(id);

  if (!contact) {
    throw new Error("Contact request not found");
  }

  if (contact.isChecked === true) {
    return {
      statusCode: 200,
      success: true,
      message: "Contact already marked as checked",
      data: contact,
    };
  }

  const updatedContact = await this.contactUsRepository.updateContactIsCheckedRepo(id);

  return {
    statusCode: 200,
    success: true,
    message: "Contact marked as checked successfully",
    data: updatedContact,
  };
  }



async deleteSingleContactRequestService(id: string) {
  if (!id) {
    throw new Error("Contact ID is required");
  }


  const contact =
    await this.contactUsRepository.getContactByIdRepo(id);

  if (!contact) {
    throw new Error("Contact request not found");
  }

  await this.contactUsRepository.deleteContactByIdRepo(id);

  return {
    statusCode: 200,
    success: true,
    message: "Contact request deleted successfully",
  };
}






}

export default CompanyContactService;
