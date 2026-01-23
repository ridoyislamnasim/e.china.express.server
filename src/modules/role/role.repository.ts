import { PrismaClient, Prisma } from '@prisma/client';
import { pagination } from '../../utils/pagination';

const prisma = new PrismaClient();

export interface RoleDoc {
  title: string;
  details: string;
  type: string;
  roleCategory: string;
  status: boolean;
  link: string;
  // add other fields as needed
}

class RoleRepository {

  // --------------------------
  // parmison
  // -----------------------
  async createPermission(payload: Prisma.PermissionCreateInput, session?: any) {
    const newPermission = await prisma.permission.create({
      data: payload,
    });
    return newPermission;
  }

  async getPermissionById(id: number) {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });
    return permission;
  }

  async updatePermission(id: number, payload: Prisma.PermissionUpdateInput, session?: any) {
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: payload,
      // ...(session && { transaction: session }),
    });
    return updatedPermission;
  }

  // --------------------------
  // role
  // -----------------------
  async createRole(payload: Prisma.RoleCreateInput, session?: any) {
    // check 
    const newRole = await prisma.role.create({
      data: payload,
      // ...(session && { transaction: session }),
    });
    return newRole;
  }

  async createSuperAdminRole() {
    // check super admin role exists
    const existingSuperAdmin = await prisma.role.findFirst({
      where: { role: 'superAdmin' },
    });
    if (existingSuperAdmin) {
     return existingSuperAdmin;
    }
    const permission = await this.createPermission({
      permissionAccess: true,
      permissionCreate: true,
      permissionUpdate: true,
      permissionDelete: true,
      blogAccess: true,
      blogCreate: true,
      blogUpdate: true,
      blogDelete: true,
      shipmentBookingAccess: true,
      shipmentBookingCreate: true,
      shipmentBookingUpdate: true,
      shipmentBookingDelete: true,
      shoppingBookingAccess: true,
      shoppingBookingCreate: true,
      shoppingBookingUpdate: true,
      shoppingBookingDelete: true,
      inventoryBookingAccess: true,
      inventoryBookingCreate: true,
      inventoryBookingUpdate: true,
      inventoryBookingDelete: true,
      suppliersAccess: true,
      suppliersCreate: true,
      suppliersUpdate: true,
      suppliersDelete: true,
      wishlistAccess: true,
      wishlistCreate: true,
      wishlistUpdate: true,
      wishlistDelete: true,
      cartAccess: true,
      cartCreate: true,
      cartUpdate: true,
      cartDelete: true,
      productAccess: true,
      productCreate: true,
      productUpdate: true,
      productDelete: true,
      orderAccess: true,
      orderCreate: true,
      orderUpdate: true,
      orderDelete: true,
      guideAccess: true,
      guideCreate: true,
      guideUpdate: true,
      guideDelete: true,
      aboutUsAccess: true,
      aboutUsCreate: true,
      aboutUsUpdate: true,
      aboutUsDelete: true,
      bannerAccess: true,
      bannerCreate: true,
      bannerUpdate: true,
      bannerDelete: true,
      couponAccess: true,
      couponCreate: true,
      couponUpdate: true,
      couponDelete: true,
      campaignAccess: true,
      campaignCreate: true,
      campaignUpdate: true,
      campaignDelete: true,
      packageAccess: true,
      packageCreate: true,
      packageUpdate: true,
      packageDelete: true,
      bandingAccess: true,
      bandingCreate: true,
      bandingUpdate: true,
      bandingDelete: true,
      policyAccess: true,
      policyCreate: true,
      policyUpdate: true,
      policyDelete: true,
      servicesAccess: true,
      servicesCreate: true,
      servicesUpdate: true,
      servicesDelete: true,
      rateAccess: true,
      rateCreate: true,
      rateUpdate: true,
      rateDelete: true,
      category1688Access: true,
      category1688Create: true,
      category1688Update: true,
      category1688Delete: true,
      categoryAccess: true,
      categoryCreate: true,
      categoryUpdate: true,
      categoryDelete: true,
      subCategoryAccess: true,
      subCategoryCreate: true,
      subCategoryUpdate: true,
      subCategoryDelete: true,
      chilsCategoryAccess: true,
      chilsCategoryCreate: true,
      chilsCategoryUpdate: true,
      chilsCategoryDelete: true,
      userAccess: true,
      userCreate: true,
      userUpdate: true,
      userDelete: true,
    });
    const newRole = await prisma.role.create({
      data: {
        role: 'superAdmin',
        permissionId: permission.id,
      },
    });
    return newRole;
  }


  async getAllRole(filter: any) {
    return await prisma.role.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        permission: true,
      },
    });
  }

  async getRoleWithPagination(payload: any) {
    return await pagination(payload, async (limit: number, offset: number) => {
      const [doc, totalDoc] = await Promise.all([
        await prisma.role.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: payload.sortOrder },
        }),
        await prisma.role.count(),
      ]);
      return { doc, totalDoc };
    });
  }

  async getRoleByRoleName(roleName: string) {
    const role = await prisma.role.findFirst({
      where: { role: roleName },
    });
    return role;
  }

  
  async getSingleRole(id: number) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { permission: true },
    });
    return role;
  }

  async getRoleByName(roleName: string) {
    const role = await prisma.role.findFirst({
      where: { role: roleName },
    });
    return role;
  }

  async updateRole(id: number, payload: Prisma.RoleUpdateInput, session?: any) {
    const updatedRole = await prisma.role.update({
      where: { id },
      data: payload,
      // ...(session && { transaction: session }),
    });
    return updatedRole;
  }

  async deleteRole(id: number) {
    const deletedRole = await prisma.role.delete({
      where: { id },
    });
    return deletedRole;
  }
}

export default new RoleRepository();
