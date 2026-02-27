"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idGenerate = idGenerate;
async function idGenerate(prefix, identifyer, model) {
    // Direct Prisma query for last item by identifyer
    // model should be a Prisma repository with a .findFirst method
    // console.log("Model in idGenerate:", model); // Log the model for debugging
    console.log("Identifyer in idGenerate:", identifyer, "Prefix:");
    const result = await model.findFirst({
        orderBy: { [identifyer]: 'desc' },
        select: { [identifyer]: true },
    });
    console.log("Result from idGenerate:", result);
    let lastId = result ? result[identifyer] : null;
    let newNumber;
    if (lastId && lastId.startsWith(prefix)) {
        // Remove prefix and date part, get the numeric part
        // Example: prefix = 'INV-', lastId = 'INV-2508011001' => numeric part is after prefix+6
        const numericPart = lastId.slice(prefix.length + 6);
        newNumber = Number(numericPart) + 1;
    }
    else {
        newNumber = 1001;
    }
    const date = new Date();
    const year = date.toLocaleString('en', { year: '2-digit' });
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    const newId = `${prefix}${dateString}${newNumber}`;
    return newId;
}
