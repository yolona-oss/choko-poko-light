import mongoose from 'mongoose'

/***
 * @description Extract value from object by string path
 *
 * @param obj - js Object to extract value from e.g. {
 *          configs: {
 *              database: {name: 'test'}
 *          }
 *        }
 *
 * @param path - path to value e.g. 'configs.database.name'
 *
 */
export function extractValueFromObject(obj: object, path: string): any {
    let ret: any = obj

    for (const node of path.split('.')) {
        ret = ret[node]
    }

    return ret
}

/***
 *
 * @returns return modified 'obj' but not modifies original
 *
 */
export function assignToCustomPath(obj: object, propPath: string, value: any) {
    let paths = new Array<string>()
    paths = propPath.split(".")

    let _obj = <any>(obj)

    if (paths.length > 1) {
        var key: any = paths.shift()
        assignToCustomPath(_obj[key] =
                           Object.prototype.toString.call(_obj[key]) === "[object Object]"
                               ? _obj[key]
                               : {},
                               paths.join('.'),
                               value)
    } else {
        _obj[paths[0]] = value
    }
    return _obj
}

export function isObjectId(str_id: string) {
    return mongoose.Types.ObjectId.isValid(str_id)
}

//export class Validatior {
//    static IsMongooseObject
//}
