"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guide_repository_1 = __importDefault(require("./guide.repository"));
const errors_1 = require("../../utils/errors");
const pagination_1 = require("../../utils/pagination");
const ImgUploder_1 = __importDefault(require("../../middleware/upload/ImgUploder"));
exports.default = new (class GuideService {
    constructor() {
        //done
        this.createGuideVideo = async (payload, payloadFiles) => {
            if (!payload.title || !payload.url || !payload.guideId || !payload.videoSerial) {
                throw new Error("Title, URL, guideId, and videoSerial are required");
            }
            console.log("🚀 ~ guide.service.ts:180 ~ payloadFiles:", payloadFiles);
            if (!payloadFiles) {
                throw new Error("Image is required");
            }
            const images = await (0, ImgUploder_1.default)(payloadFiles.files);
            for (const key in images) {
                payload[key] = images[key];
            }
            if (payloadFiles && payloadFiles.length !== 0) {
                const images = await (0, ImgUploder_1.default)(payloadFiles.files);
                for (const key in images) {
                    payload[key] = images[key];
                }
            }
            const video = await guide_repository_1.default.createGuideVideo({
                guideId: payload.guideId,
                title: payload.title,
                url: payload.url,
                shortDes: payload.shortDes,
                videoLength: payload.videoLength,
                videoSerial: payload.videoSerial,
                ...(images || {}),
            });
            return {
                message: "Guide video created successfully",
                data: video,
            };
        };
    }
    //done
    async getAllGuideWithPagination(query) {
        return await (0, pagination_1.pagination)(query, async (limit, offset) => {
            try {
                // Fetch paginated guides
                const guides = await guide_repository_1.default.getAllGuidesWithPaginationRepository({
                    limit,
                    offset,
                });
                // Count total guides for pagination meta
                const totalDoc = await guide_repository_1.default.countGuidesRepository();
                return { doc: guides, totalDoc };
            }
            catch (error) {
                console.error("Error fetching paginated guides:", error);
                throw error;
            }
        });
    }
    async getAllGuides() {
        let allGuides = [];
        let allGuidesVideos = [];
        try {
            allGuides = await guide_repository_1.default.getAllGuidesRepository();
            // allGuidesVideos = await guideRepository.getAllGuidesVideosRepository();
        }
        catch (error) {
            console.error("Error getting all guides:", error);
            throw error;
        }
        return { allGuides, count: allGuides.length };
    }
    async deleteGuideData(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide ID provided for deletion.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const existingGuide = await guide_repository_1.default.getGuideData(guideId);
            if (!existingGuide) {
                throw new errors_1.NotFoundError(`Guide with ID ${guideId} not found for deletion.`);
            }
            // const totalDeleted = await guideRepository.deleteAllGuideVideos(guideId);
            // if (!totalDeleted) {
            //   console.error(`Unable to delete guide videos of ${guideId}`);
            //   throw new Error("Unable to delete guide videos.");
            // }
            try {
                const guideVideos = await guide_repository_1.default.deleteAllGuideVideos(guideId);
                console.log(`Deleted ${guideVideos} videos for guide ID ${guideId}`);
            }
            catch (error) {
                console.error("Unable to delete all guide videos for guide ID", guideId, error);
                throw error; // re-throw if you want upper layers to handle it
            }
            // if (guideVideos && guideVideos.length > 0) {
            //   for (const video of guideVideos) {
            //     await guideRepository.deleteAllGuideVideos(video.id);
            //   }
            // }
            const data = await guide_repository_1.default.deleteGuideRepository(guideId);
            return { message: `Guide data with id ${id} deleted successfully`, data: data };
        }
        catch (error) {
            console.error("Error deleting guide data:", error);
            throw error;
        }
    }
    async getGuideVideosById(id) {
        // Fetch videos for the guide
        const guideVideos = await guide_repository_1.default.findVideosByGuideId(id);
        // If no videos found, send a response
        if (!guideVideos || guideVideos.length === 0) {
            return {
                status: "success",
                message: `No videos found for guide with ID ${id}`,
                data: [],
            };
        }
        // If videos exist, return them
        return {
            status: "success",
            message: `Guide videos retrieved successfully.`,
            data: guideVideos,
        };
    }
    async updateGuideData(id, payload) {
        const guideId = Number(id);
        if (isNaN(guideId)) {
            throw new Error("Invalid guide id");
        }
        const existingGuide = await guide_repository_1.default.findGuideById(guideId);
        if (!existingGuide) {
            throw new errors_1.NotFoundError("Guide not found");
        }
        const currentSerial = existingGuide.serial;
        const totalGuides = await guide_repository_1.default.countGuidesRepository();
        const newSerial = payload.serial;
        if (newSerial !== undefined) {
            if (newSerial < 1 || newSerial > totalGuides) {
                throw new Error(`Serial must be between 1 and ${totalGuides}`);
            }
            if (newSerial !== currentSerial) {
                if (currentSerial < newSerial) {
                    await guide_repository_1.default.shiftSerialDown(currentSerial, newSerial);
                }
                if (currentSerial > newSerial) {
                    await guide_repository_1.default.shiftSerialUp(currentSerial, newSerial);
                }
            }
        }
        const updatedGuide = await guide_repository_1.default.updateGuideById(guideId, payload);
        return {
            message: "Guide updated successfully",
            data: updatedGuide,
        };
    }
    async deleteGuideVideo(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide Video ID provided for deletion.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const existingGuide = await guide_repository_1.default.getGuideVideo(guideId);
            if (!existingGuide) {
                throw new errors_1.NotFoundError(`Guide Video ID ${guideId} not found for deletion.`);
            }
            const data = await guide_repository_1.default.deleteGuideVideoRepository(guideId);
            return { message: `Guide Video ID ${id} deleted successfully`, data };
        }
        catch (error) {
            console.error("Error deleting guide data:", error);
            throw error;
        }
    }
    async createGuideData(payload, payloadFiles) {
        const { title, serial } = payload;
        if (!title || serial === undefined) {
            const missingFields = [];
            if (!title)
                missingFields.push("title");
            if (serial === undefined)
                missingFields.push("serial");
            const error = new Error(`Missing required field(s): ${missingFields.join(", ")}`);
            error.statusCode = 400;
            throw error;
        }
        if (serial !== undefined && (await guide_repository_1.default.isSerialExists(serial))) {
            throw Object.assign(new Error(`Serial ${serial} already exists.`), { statusCode: 400 });
        }
        if (title !== undefined && (await guide_repository_1.default.isTitleExists(title))) {
            throw Object.assign(new Error(`Title "${title}" already exists.`), { statusCode: 400 });
        }
        const totalGuides = await guide_repository_1.default.countGuidesRepository();
        if (serial < 1 || serial > totalGuides + 1) {
            throw new Error(`Please use serial between 1 and ${totalGuides + 1}`);
        }
        if (totalGuides !== 0) {
            await guide_repository_1.default.adjustSerialsForCreate(serial);
        }
        const dataToSave = { title, serial };
        const { files } = payloadFiles;
        if (files && files.length > 0) {
            const images = await (0, ImgUploder_1.default)(files); // returns object { imgSrc: '...', thumbnail: '...' }
            for (const key in images) {
                dataToSave[key] = images[key];
            }
        }
        // 5️⃣ Create in DB
        const newGuide = await guide_repository_1.default.createGuideRepository(dataToSave);
        return newGuide;
    }
    //todo
    async getGuideById(id) {
        const guideId = parseInt(id, 10);
        if (isNaN(guideId)) {
            const error = new Error("Invalid Guide ID provided.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const guide = await guide_repository_1.default.getGuideData(guideId);
            if (!guide) {
                throw new errors_1.NotFoundError(`Guide with ID ${guideId} not found.`);
            }
            const responseData = {
                id: guide.id,
                serial: guide.serial,
                title: guide.title,
                createdAt: guide.createdAt,
                updatedAt: guide.updatedAt,
                videos: guide.guideVideos.map((video) => {
                    var _a, _b, _c, _d;
                    return ({
                        id: video.id,
                        guideId: video.guideId,
                        url: video.url,
                        videoSerial: video.videoSerial,
                        imgSrc: (_a = video.imgSrc) !== null && _a !== void 0 ? _a : undefined,
                        videoLength: (_b = video.videoLength) !== null && _b !== void 0 ? _b : undefined,
                        title: (_c = video.title) !== null && _c !== void 0 ? _c : undefined,
                        shortDes: (_d = video.shortDes) !== null && _d !== void 0 ? _d : undefined,
                        createdAt: video.createdAt,
                        updatedAt: video.updatedAt,
                    });
                }),
            };
            return responseData;
        }
        catch (error) {
            console.error("Error retrieving guide data by ID:", error);
            throw error;
        }
    }
    async updateGuideVideo(id, payload, payloadFiles) {
        const { files } = payloadFiles;
        if (!files)
            throw new Error("Image is required");
        if (isNaN(id)) {
            const error = new Error("Invalid id provided for update.");
            error.statusCode = 400;
            throw error;
        }
        const existingGuide = await guide_repository_1.default.getGuideVideoData(id);
        if (!existingGuide) {
            throw new errors_1.NotFoundError(`Id ${id} not found for update.`);
        }
        if (files && files.length > 0) {
            const images = await (0, ImgUploder_1.default)(files); // returns object { imgSrc: '...', thumbnail: '...' }
            Object.assign(payload, images);
        }
        const isSameSerial = await guide_repository_1.default.getGuideVideo(id);
        if (payload.videoSerial !== isSameSerial.videoSerial) {
            const allVideos = await guide_repository_1.default.findVideosByGuideId(payload.guideId);
            const givenVideo = allVideos.filter((video) => video.id === id);
            if (givenVideo.videoSerial !== payload.videoSerial) {
                allVideos.some((video) => {
                    if (video.videoSerial === payload.videoSerial) {
                        throw new errors_1.NotFoundError(`Change the video Serial.`);
                    }
                });
            }
            return;
        }
        // console.log("🚀 ~ guide.service.ts:337 ~ updateGuideVideo ~ allVideos:", allVideos)
        // const serialExists = allVideos.some(
        //   (video:any) => {
        //     if(video.videoSerial !== payload.videoSerial ){
        //       return video;
        //     }
        //   }
        // );
        // console.log("🚀 ~ guide.service.ts:340 ~ updateGuideVideo ~ payload.videoSerial:", payload.videoSerial)
        // console.log("🚀 ~ guide.service.ts:340 ~ updateGuideVideo ~ video.videoSerial:", video.videoSerial)
        // console.log("🚀 ~ guide.service.ts:344 ~ updateGuideVideo ~ serialExists:", serialExists)
        // return 
        // if (Object.keys(isSameSerial).length != 0 && isSameSerial.videoSerial === payload.videoSerial) {
        //   throw new NotFoundError(`Change the video Serial.`);
        // }
        try {
            const updatedGuide = await guide_repository_1.default.updateGuideVideoRepository(id, payload);
            return {
                message: `Guide data with serial ${id} updated successfully`,
                data: updatedGuide,
            };
        }
        catch (error) {
            console.error("Error updating guide data:", error);
            throw error;
        }
    }
})();
