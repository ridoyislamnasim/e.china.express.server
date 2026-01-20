import { NotFoundError } from "../../utils/errors";
import { BaseService } from "../base/base.service";
import roleRepository from "./role.repository";
// import { removeUploadFile } from '../../middleware/upload/removeUploadFile';

import ImgUploader from "../../middleware/upload/ImgUploder";

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
    const parmison = await this.repository.createPermission({});
    payload.permissionId = parmison.id;
    // check role exists
    const existingRole = await this.repository.getAllRole({ role: payload.role });
    if (existingRole.length > 0) {
      const error = new Error("Role already exists");
      (error as any).statusCode = 409;
      throw error;
    }
    const roleData = await this.repository.createRole(payload);
    return roleData;
  }
  

  async getAllRole(payload: any) {
    const { roleType } = payload;
    const filter: any = {};
    if (roleType) filter.roleType = roleType;
    return await this.repository.getAllRole(filter);
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

  async updateRole(id: string, payload: any,session?: any) {
    const roleData = await this.repository.updateRole(Number(id), payload);
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
