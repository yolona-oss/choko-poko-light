import { AppError, AppErrorTypeEnum } from "./../app-error"
import { assignToCustomPath } from "./helpers"

import { IBuilder } from "./../types/builder.type"

type TransformFn = (value: any) => any
type ValidateFn = (value: any) => boolean
type ValidateFnArray = Array<ValidateFn>

const defaultValidator: ValidateFn = (v) => {
    if (v !== undefined && v !== null) {
        return true
    }
    return false
}

const dummyTransfomr: TransformFn = (v) => v
//const dummyValidator: ValidateFn = (v: any) => {v;return true}

/***
 * addToQuery workflow
 * check -> validate -> transform
 *
 * check - only use to add in builded object, commonly validate data for null or undefined, no throws
 * validate - validate value and throws if non true
 * transform - transform value
 *
 * example:
 * new query = new OPQBuilder()
 *     .from({ category: 'coconuts' })
 *     .addCheckOptionForKey('price', (v) => tyepof v === 'number')
 *     .addToQuery('price', opts.minPrice, (v) => { { $gt: v } })
 *     .build()
 *
 * TODO: create generic capab version to add keys by generic keyof or directly from type
 */
export class OPQBuilder implements IBuilder<Record<string, any>> {
    private options: Record<string, any>

    private globalValidators: ValidateFnArray
    private validators: Map<string, ValidateFnArray>

    private globalChecks: ValidateFnArray
    private checks: Map<string, ValidateFnArray>

    private useGlobalValidationForMapped: boolean = true
    private useGlobalCheckForMapped: boolean = true

    constructor() {
        this.globalValidators = new Array<ValidateFn>()
        this.globalChecks = new Array<ValidateFn>()
        this.validators = new Map<string, ValidateFnArray>()
        this.checks = new Map<string, ValidateFnArray>()
        this.options = new Object({})

        this.createDefaultCheck()
    }

    from(target: object, allowOverwrite = true) {
        if (!allowOverwrite && Object.keys(this.options).length > 0) {
            throw new Error("Cannot overwrite options")
        }
        this.options = target
        return this
    }

    setUseGlobalCheckForMapped(use = true) {
        this.useGlobalCheckForMapped = use
        return this
    }

    setUseGlobalValidationForMapped(use = true) {
        this.useGlobalValidationForMapped = use
        return this
    }

    addCheckOptionForKey(key: string, fn: ValidateFn) {
        let exists = this.checks.get(key) || []
        this.checks.set(key, [...exists, fn])
        return this
    }

    addValidatorForKey(key: string, fn: ValidateFn) {
        let exists = this.validators.get(key) || []
        this.validators.set(key, [...exists, fn])
        return this
    }

    addGlobalCheck(fn: ValidateFn) {
        this.globalChecks.push(fn)
        return this
    }

    addGlobalValidator(fn: ValidateFn) {
        this.globalValidators.push(fn)
        return this
    }

    clearGlobalChecks() {
        this.globalChecks = new Array<ValidateFn>()
        return this
    }

    clearGlobalValidators() {
        this.globalValidators = new Array<ValidateFn>()
        return this
    }

    clearMappedValidators() {
        this.validators = new Map<string, Array<ValidateFn>>()
        return this
    }

    clearOptions() {
        this.options = new Object({})
        return this
    }

    /***
     * Add record to current building object
     *
     * @property key - name of option e.g. 'size' or 'user.media.videos'
     * @property value - value of option e.g. 10 { $gte: 10 }
     * @property transform - function to transform value e.g. (v) => return { otherPath: { $gte: v } }
     */
    addToQuery(
        key: string,
        value: any,
        transform: TransformFn = dummyTransfomr
    ) {
        // check

        const mappedChecks = this.checks.get(key) || []
        const globalChecks = this.globalChecks

        const checkers = []

        checkers.push(...mappedChecks)
        if (this.useGlobalCheckForMapped || !mappedChecks.length) {
            checkers.push(...globalChecks)
        }

        for (const check of checkers) {
            if (!check(value)) {
                return this
            }
        }

        // validate

        const mappedValidators = this.validators.get(key) || []
        const globalValidators = this.globalValidators

        const validators = []

        validators.push(...mappedValidators)
        if (this.useGlobalValidationForMapped || !mappedValidators) {
            validators.push(...globalValidators)
        }

        for (const validate of validators) {
            if (!validate(value)) {
                throw new AppError(AppErrorTypeEnum.VALIDATION_ERROR, {
                    errorMessage: `Invalid value for \'${key}\': ${value}`,
                    userMessage: `Invalid value for \'${key}\': ${value}`
                })
            }
        }

        // transform && apply

        this.options = assignToCustomPath(this.options, key, transform(value))

        return this
    }

    build() {
        const copy = this.options
        this.clearOptions()
        this.clearGlobalValidators()
        this.clearMappedValidators()
        this.createDefaultCheck()
        this.setUseGlobalValidationForMapped(true)
        this.setUseGlobalCheckForMapped(true)
        return copy
    }

    private createDefaultCheck() {
        this.clearGlobalChecks()
        this.addGlobalCheck(defaultValidator)
    }
}
