import { AppError, AppErrorTypeEnum } from "./../app-error"
import { assignToCustomPath } from "./helpers"

import { IBuilder } from "./../types/builder.type"

type TransformFn = (value: any) => any
type ValidateFn = (value: any) => boolean

const defaultValidator: ValidateFn = (v) => {
    if (v !== undefined || v !== null) {
        return true
    }
    return false
}

const dummyTransfomr: TransformFn = (v) => v
const dummyValidator: ValidateFn = (v: any) => {v;return true}

export class OPQBuilder implements IBuilder<Record<string, any>> {
    private options: Record<string, any>
    private globalValidators: Array<ValidateFn>
    private validators: Map<string, Array<ValidateFn>>
    private useGlobalValidationForMapped: boolean = true

    constructor() {
        this.globalValidators = new Array<ValidateFn>()
        this.validators = new Map<string, Array<ValidateFn>>()
        this.options = new Object({})

        this.createDefaultvalidator()
    }

    from(target: object, allowOverwrite = true) {
        if (!allowOverwrite && Object.keys(this.options).length > 0) {
            throw new Error("Cannot overwrite options")
        }
        this.options = target
        return this
    }

    addCheckOptionForKey(key: string, fn: ValidateFn) {
        let exists = this.validators.get(key) || []
        this.validators.set(key, [...exists, fn])
        return this
    }

    addGlobalCheck(fn: ValidateFn) {
        this.globalValidators.push(fn)
        return this
    }

    setUseGlobalValidationForMapped(use = true) {
        this.useGlobalValidationForMapped = use
        return this
    }

    clearGlobalValidators() {
        this.globalValidators = new Array<ValidateFn>()
        return this
    }

    clearValidators() {
        this.validators = new Map<string, Array<ValidateFn>>()
        return this
    }

    clearOptions() {
        this.options = new Object({})
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
        transform: TransformFn = dummyTransfomr
    ) {
        const mappedValidators = this.validators.get(key)

        for (const validate of mappedValidators || [dummyValidator]) {
            if (!validate(value)) {
                throw new AppError(AppErrorTypeEnum.DB_VALIDATION_ERROR, {
                    errorMessage: `Invalid value for \'${key}\': ${value}`,
                    userMessage: `Invalid value for \'${key}\': ${value}`
                })
            }
        }

        if (this.useGlobalValidationForMapped) {
            for (const globalValidator of this.globalValidators) {
                if (!globalValidator(value)) {
                    throw new AppError(AppErrorTypeEnum.DB_VALIDATION_ERROR, {
                        errorMessage: `Invalid value for \'${key}\': ${value}`,
                        userMessage: `Invalid value for \'${key}\': ${value}`
                    })
                }
            }
        }

        this.options = assignToCustomPath(this.options, key, transform(value))

        return this
    }

    build() {
        const copy = this.options
        this.clearOptions()
        this.clearGlobalValidators()
        this.clearValidators()
        this.createDefaultvalidator()
        this.setUseGlobalValidationForMapped(true)
        return copy
    }

    private createDefaultvalidator() {
        this.addGlobalCheck(defaultValidator)
    }
}
