import { isValidObjectId } from "mongoose"
import { AppError } from "./error/AppError"
import { AppErrorTypeEnum } from "./error/AppErrorTypeEnum"
import { extractValueFromObject, assignToCustomPath } from "./helpers"

export class OPQBuilder {
    private options: Record<string, any>

    constructor() {
        this.options = new Object({})
    }

    from(target: object) {
        this.options = target
        return this
    }

    /***
     *
     * @property key - name of option e.g. 'size' or 'user.media.videos'
     * 
     * @property value - value of option e.g. 10 { $gte: 10 }
     *
     */
    addToQuery(
        key: string,
        value: any,
        transform?: ((value: any) => any) | null,
        validate?: (value: any) => boolean
    ) {
        if (validate && !validate(value)) {
            throw new AppError(AppErrorTypeEnum.DB_VALIDATION_ERROR, {
                errorMessage: `Invalid value for \'${key}\': ${value}`,
                userMessage: `Invalid value for \'${key}\': ${value}`
            })
        }
        if (value !== undefined) {
            this.options = assignToCustomPath(this.options, key, transform ? transform(value) : value)
        }
        return this
    }

    build() {
        const copy = this.options
        this.options = new Object({})
        return copy
    }
}
