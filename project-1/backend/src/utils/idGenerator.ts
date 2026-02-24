import { db } from '../db.js';

export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-')      // Replace multiple - with single -
        .substring(0, 20);         // Limit length
};

export const getNextId = async (tableName: string, prefix: string, nameHint?: string): Promise<string> => {
    try {
        const result = await db.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = parseInt(result.rows[0].count) + 1;

        let id = `${prefix}-${count}`;

        if (nameHint) {
            id += `-${slugify(nameHint)}`;
        }

        return id;
    } catch (err: any) {
        console.error(`Error in getNextId for ${tableName}:`, err);
        throw err;
    }
};

export const getFormattedDate = (): string => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}${month}${year}`;
};
