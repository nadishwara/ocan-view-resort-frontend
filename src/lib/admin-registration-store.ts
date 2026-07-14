import { promises as fs } from "fs";
import path from "path";

interface AdminRegistrationState {
    adminExists: boolean;
}

const STORE_PATH = path.join(process.cwd(), ".data", "admin-registration.json");

async function readState(): Promise<AdminRegistrationState> {
    try {
        const content = await fs.readFile(STORE_PATH, "utf8");
        const parsed = JSON.parse(content) as Partial<AdminRegistrationState>;

        return {
            adminExists: parsed.adminExists === true,
        };
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return { adminExists: false };
        }

        console.error("Failed to read admin registration state:", error);
        return { adminExists: false };
    }
}

async function writeState(state: AdminRegistrationState): Promise<void> {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
}

export async function hasAdminRegistration(): Promise<boolean> {
    const state = await readState();
    return state.adminExists;
}

export async function reserveAdminRegistration(): Promise<boolean> {
    const state = await readState();

    if (state.adminExists) {
        return false;
    }

    await writeState({ adminExists: true });
    return true;
}
