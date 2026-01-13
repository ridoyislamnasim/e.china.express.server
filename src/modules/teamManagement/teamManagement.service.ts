import ImgUploader from "../../middleware/upload/ImgUploder";
import { TeamMember } from "../../types/team-management.interface";
import TeamManagementRepository from "./teamManagement.repository";

class TeamManagementService {
  private teamManagementRepository = new TeamManagementRepository();


  async createTeamMemberService(payloadFiles:any,payload: any) {
    const checkEmail = await this.teamManagementRepository.checkTeamMemberEmail(payload.email)
    const { files } = payloadFiles;
    
    if (!files) {
       throw new Error('Image is required');
    }

    console.log('Creating team member with files:', files);
    if (!payload.email || !payload.name || !payload.location || !payload.language || !payload.rating) {
      throw new Error("Required field needs to be full filled.")
    }
    
    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }



    if (checkEmail) {
      throw new Error("Email number already exist.");
    }
    
    const normalizedPayload: Partial<TeamMember> = {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      origin: payload.origin?.trim() || "",
      location: payload.location?.trim() || "",
      language: payload.language?.trim() || "",
      rating: Number(payload.rating) || 0,
      avatar:payload.avatar
    };

    const savedMember = await this.teamManagementRepository.createTeamMemberRepo(normalizedPayload);

    return savedMember;
  }















  async getAllTeamMembersService() {
    return await this.teamManagementRepository.getAllTeamMembersRepo();
  }

  async getAllTeamMembersPaginationService (payload:any) {
        return await this.teamManagementRepository.getAllTeamMembersPaginationRepo(payload);
  }

  /* ==============================
     Get Single Team Member
  ================================ */
  async getSingleTeamMemberByIdService(id: string) {
    if (!id) {
      throw new Error("Team member ID is required");
    }

    const member = await this.teamManagementRepository.getTeamMemberByIdRepo(id);

    if (!member) {
      throw new Error("Team member not found");
    }

    return {
      statusCode: 200,
      success: true,
      message: "Team member fetched successfully",
      data: member,
    };
  }

  /* ==============================
     Update Team Member
  ================================ */
  async updateTeamMemberService(id: string, payload: Partial<TeamMember>,payloadFiles:any) {
    if (!id) {
      throw new Error("Team member ID is required");
    }

    const { files } = payloadFiles || {};
    
    if (files && files.length > 0) {
      const images = await ImgUploader(files);
      for (const key in images) {
        (payload as any)[key] = images[key];
      }
    }

    if (!payload.email || !payload.name || !payload.location || !payload.language || !payload.rating) {
      throw new Error("Required field needs to be full filled.")
    }


    const existingMember = await this.teamManagementRepository.getTeamMemberByIdRepo(id);

    if (!existingMember) {
      throw new Error("Team member not found");
    }

    if (existingMember.email !== payload.email) {
        if (payload.email) {
        const email = await this.teamManagementRepository.checkTeamMemberEmail(payload.email)
        
        if (email) {
          throw new Error("Email already exist.") 
        }      
      }
    }




    const normalizedPayload: Partial<TeamMember> = {
      ...payload,
      name: payload.name?.trim(),
      email: payload.email?.toLowerCase().trim(),
      origin: payload.origin?.trim(),
      location: payload.location?.trim(),
      language: payload.language?.trim(),
      rating: payload.rating !== undefined ? Number(payload.rating) : undefined,
      avatar: payload.avatar,
    };

    const updatedMember = await this.teamManagementRepository.updateTeamMemberRepo(id, normalizedPayload);

    return {
      statusCode: 200,
      success: true,
      message: "Team member updated successfully",
      data: updatedMember,
    };
  }

  /* ==============================
     Delete Team Member
  ================================ */
  async deleteTeamMemberService(id: string) {
    if (!id) {
      throw new Error("Team member ID is required");
    }

    const member = await this.teamManagementRepository.getTeamMemberByIdRepo(id);

    if (!member) {
      throw new Error("Team member not found");
    }

    await this.teamManagementRepository.deleteTeamMemberByIdRepo(id);

    return {
      statusCode: 200,
      success: true,
      message: "Team member deleted successfully",
    };
  }
}

export default TeamManagementService;
