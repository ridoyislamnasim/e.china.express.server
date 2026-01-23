import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import roleRepository from "./role.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";
import authRepository from "../auth/auth.repository";

export class RoleService extends BaseService<typeof roleRepository> {
  private repository: typeof roleRepository;
  constructor(repository: typeof roleRepository, serviceName: string) {
    super(repository);
    this.repository = repository;
  }

  async createRole(payload: any,  session?: any) { 
    // check role not superAdmin
    if (payload.role === "superAdmin") {
      const error = new Error("Cannot create role with name superAdmin");
      (error as any).statusCode = 400;
      throw error;
    }
    // check role exists
    const existingRole = await this.repository.getRoleByRoleName(payload.role);
    console.log("existingRole", existingRole);
    if (existingRole) {
      const error = new Error("Role already exists");
      (error as any).statusCode = 409;
      throw error;
    }
    const permission = await this.repository.createPermission(payload.permissions, session);
    const rolePayload = {
      role: payload.role,
      permissionId: permission.id,
    };

    const roleData = await this.repository.createRole(rolePayload, session);
    return roleData;
  }
  
  async getAllRole(payload: any) {
    const { roleType } = payload;
    const filter: any = {};
    if (roleType) filter.roleType = roleType;
    return await this.repository.getAllRole(filter);
  }

  async getAuthRole(userId: number | undefined) {
    if (!userId) {
      const error = new Error("User ID is required");
      (error as any).statusCode = 400;
      throw error;
    }
    const role = await authRepository.getUserRoleById(userId);
    if (!role) {
      const error = new Error("Role not found for the user");
      (error as any).statusCode = 404;
      throw error;
    }
    return role;
  }

  async getRoleWithPagination(payload: any) {
    const role = await this.repository.getRoleWithPagination(payload);
    return role;
  }

  async getSingleRole(id: string) {
    const numericId = Number(id);
    const roleData = await this.repository.getSingleRole(numericId);
    if (!roleData) throw new NotFoundError("Role Not Find");
    return roleData;
  }

  async updateRole(id: string, payload: any, session?: any) {
    // check role not superAdmin
    if (payload.role === "superAdmin") {
      const error = new Error("Cannot update role with name superAdmin");
      (error as any).statusCode = 400;
      throw error;
    }
    // check role exists
    const existingRole = await this.repository.getSingleRole(Number(id));
    if (!existingRole) {
      const error = new Error("Role not found");
      (error as any).statusCode = 404;
      throw error;
    }
    // check if permissionId exists then update permission
    const permissionId = existingRole.permissionId;
    const permission = await this.repository.getPermissionById(permissionId!);
    if (!permission) {
      const error = new Error("Permission not found for the role");
      (error as any).statusCode = 404;
      throw error;
    }
    if (existingRole.permissionId !== null) {
      await this.repository.updatePermission(existingRole.permissionId, payload.permissions, session);
    }
    // if not change role then update only permissions
    if (existingRole.role === payload.role) {
      return existingRole;
    }
    const rolePayload = {
      role: payload.role,
    };
    const roleData = await this.repository.updateRole(Number(id), rolePayload , session);
    if (!roleData) throw new NotFoundError("Role Not Find");
    return roleData;
  }

  async deleteRole(id: string) {
    const numericId = Number(id);
    const deletedRole = await this.repository.deleteRole(numericId);
    if (deletedRole) {
      // await removeUploadFile(role?.image);
    }
    return deletedRole;
  }
}

export default new RoleService(roleRepository, "role");
