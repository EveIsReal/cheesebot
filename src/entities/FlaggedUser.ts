import { Entity, EntityRepositoryType, PrimaryKey, Property } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/sqlite"

import { CustomBaseEntity } from "./BaseEntity"

// ===========================================
// ================= Entity ==================
// ===========================================

@Entity({ customRepository: () => FlaggedUserRepository })
export class FlaggedUser extends CustomBaseEntity {

    [EntityRepositoryType]?: FlaggedUserRepository

    @PrimaryKey({ autoincrement: false })
    id!: string

    @Property()
    lastInteract: Date = new Date()

    @Property()
    flaggedSince: Date = new Date();
}

// ===========================================
// =========== Custom Repository =============
// ===========================================

export class FlaggedUserRepository extends EntityRepository<FlaggedUser> { 

    async updateLastInteract(userId?: string): Promise<void> {

        const user = await this.findOne({ id: userId })

        if (user) {
            user.lastInteract = new Date()
            await this.flush()
        }
    }
}