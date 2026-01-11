import { TeamMember } from "@prisma/client";
import { pagination } from "../../utils/pagination";
import prisma from "../../config/prismadatabase";

class TeamManagementRepository {
  /* ==============================
     Create Team Member
  ================================ */
  async createTeamMemberRepo(payload: Partial<TeamMember>) {
    return await prisma.teamMember.create({
      data: {
        name: payload.name!,
        email: payload.email!,
        avatar: payload.avatar,
        rating: payload.rating ?? 0,
        origin: payload.origin!,
        location: payload.location!,
        language: payload.language!,
      },
    });
  }

  /* ==============================
     Get All Team Members (Pagination)
  ================================ */
  async getAllTeamMembersRepo() {
    return await prisma.teamMember.findMany()
  }

async getAllTeamMembersPaginationRepo(payload: any) {

  return await pagination(payload, async (limit: number, offset: number, sortOrder: any) => {


    const [doc, totalDoc] = await Promise.all([
        prisma.teamMember.findMany({
          skip: offset,
          take: limit,
        }),
      
        prisma.teamMember.count({}),
    ]);

    return { doc, totalDoc };
  });
}

  /* ==============================
     Get Single Team Member by ID
  ================================ */
  async getTeamMemberByIdRepo(id: string) {
    return await prisma.teamMember.findUnique({
      where: { id: Number(id) },
    });
  }

  /* ==============================
     Update Team Member
  ================================ */
  async updateTeamMemberRepo(id: string, payload: Partial<TeamMember>) {
    return await prisma.teamMember.update({
      where: { id: Number(id) },
      data: payload,
    });
  }


  async deleteTeamMemberByIdRepo(id: string) {
    await prisma.teamMember.delete({
      where: { id: Number(id) },
    });

    return {
      id: Number(id),
      deleted: true,
    };
  }


  async checkTeamMemberEmail(email:string){
    const teamMember = await prisma.teamMember.findFirst({
      where:{
        email:email
      }
    })

    return teamMember;
  }

}

export default TeamManagementRepository;
