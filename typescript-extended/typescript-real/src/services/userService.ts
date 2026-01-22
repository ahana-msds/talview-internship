import { User } from "../models/user"
import { log } from "../utils/logger"

// business logic layer
export function getUser(): User {
    const user: User = {
        id: 1,
        name: "ahana",
        email: "ahana@talview.com"
    }

    log("user fetched successfully")
    return user
}
