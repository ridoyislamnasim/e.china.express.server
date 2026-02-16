import prisma from "../../config/prismadatabase";

export class AddressRepository {
  private prisma = prisma;

  //=================Create Address===================
  async createAddress(payload: any, tx?: any): Promise<any> {
    const prismaClient = tx || this.prisma;

    return await prismaClient.address.create({
      data: payload,
    });
  }

  //================UpdateAddress==================
  async updateAddress(id: number, payload: any, tx?: any): Promise<any> {
    const prismaClient = tx || this.prisma;
    return await prismaClient.address.update({
      where: { id },
      data: payload,
    });
  }

  //==============Get Address by Id===============
  async getAddressById(id: number): Promise<any> {
    return await this.prisma.address.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  //==============Set all the addresses for a user to non-default=============
  async unsetDefaultAddresses(userId: number, tx?: any): Promise<void> {
    const prismaClient = tx || this.prisma;
    await prismaClient.address.updateMany({
      where: { userId },
      data: { defaultAddress: false },
    });
  }

  //==============Count User Address=========
  async countUserAddresses(userId: number): Promise<any> {
    return await this.prisma.address.count({ where: { userId } });
  }
}

const addressRepository = new AddressRepository();
export default addressRepository;
