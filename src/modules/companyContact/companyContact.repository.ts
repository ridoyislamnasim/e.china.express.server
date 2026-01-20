import { pagination } from "../../utils/pagination";
import prisma from "../../config/prismadatabase";
import { CompanyContacts, ContactMessage } from "../../types/contact-us.interface";

class CompanyContactsRepository {
  /* ==============================
     Create Company Contact Info
     (usually only ONE record exists)
  ================================ */

  private prisma = prisma


  
async updateCompanyContactRepo(data: CompanyContacts) {
  // return await this.prisma.companyContacts.update({
  //   where: {
  //     id: data.id, // 👈 Prisma primary key
  //   },
  //   data: {
  //     phones: data.phones,
  //     email: data.email,
  //     businessHourStart: data.businessHourStart,
  //     businessHourEnd: data.businessHourEnd,
  //     emergencyHotlines: data.emergencyHotlines,
  //     facebook: data.facebook,
  //     twitter: data.twitter,
  //     linkedin: data.linkedin,
  //     instagram: data.instagram,
  //     youtube: data.youtube,
  //   },
  // });
}


async createCompanyContactRepo(data: CompanyContacts) {
  // return await this.prisma.companyContacts.create({

  //   data: {
  //     phones: data.phones,
  //     email: data.email,
  //     businessHourStart: data.businessHourStart,
  //     businessHourEnd: data.businessHourEnd,
  //     emergencyHotlines: data.emergencyHotlines,
  //     facebook: data.facebook,
  //     twitter: data.twitter,
  //     linkedin: data.linkedin,
  //     instagram: data.instagram,
  //     youtube: data.youtube,
  //   },
  // });
}



  /* ==============================
     Create Contact Us Message
  ================================ */
  async createContactUsRequestRepo(payload: ContactMessage) {
    return await this.prisma.contactMessage.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
        // isChecked defaults to false (this.Prisma handles it)
      },
    });
  }

  /* ==============================
     Get All Contact Messages (Pagination)
  ================================ */
  async getAllContactRequestsRepo(payload: { page?: number; limit?: number }) {
    return await pagination(payload, async (limit: number, offset: number) => {
      const [doc, totalDoc] = await Promise.all([
        this.prisma.contactMessage.findMany({
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        this.prisma.contactMessage.count(),
      ]);

      return { doc, totalDoc };
    });
  }

  /* ==============================
     Get Contact Message by ID
  ================================ */
  async getContactByIdRepo(id: string) {
    return await this.prisma.contactMessage.findUnique({
      where: {
        id: Number(id),
      },
    });
  }


  async getCompanyContactInfoRepo(){
    // return await this.prisma.companyContacts.findMany({})
  }

  /* ==============================
     Mark Contact Message as Checked
  ================================ */
  async updateContactIsCheckedRepo(id: string) {
    return await this.prisma.contactMessage.update({
      where: {
        id: Number(id),
      },
      data: {
        isChecked: true,
      },
    });
  }

  /* ==============================
     Delete Contact Message
  ================================ */
  async deleteContactByIdRepo(id: string) {
    await this.prisma.contactMessage.delete({
      where: {
        id: Number(id),
      },
    });

    return {
      id: Number(id),
      deleted: true,
    };
  }
}

export default CompanyContactsRepository;
