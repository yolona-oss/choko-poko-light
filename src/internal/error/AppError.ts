import { AppErrorTypeEnum } from './AppErrorTypeEnum';
import { IErrorMessage } from './IErrorMessage';
import { HttpStatus } from '@nestjs/common';

const errors: Record<AppErrorTypeEnum, IErrorMessage> = {
    [AppErrorTypeEnum.BAD_REQUEST]: {
        type: AppErrorTypeEnum.BAD_REQUEST,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Bad Request',
        userMessage: 'Bad Request'
    },
    [AppErrorTypeEnum.DB_ENTITY_EXISTS]: {
        type: AppErrorTypeEnum.DB_ENTITY_EXISTS,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errorMessage: 'Entity exists',
        userMessage: 'Entity exists'
    },
    [AppErrorTypeEnum.DB_CANNOT_READ]: {
        type: AppErrorTypeEnum.DB_CANNOT_READ,
        httpStatus: HttpStatus.NOT_FOUND,
        errorMessage: 'Cannot read entity.',
        userMessage: 'Cannot read entity.'
    },
    [AppErrorTypeEnum.DB_ENTITY_NOT_FOUND]: {
        type: AppErrorTypeEnum.DB_ENTITY_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
        errorMessage: 'Entity not found',
        userMessage: 'Unable to find the entity with the provided information.'
    },
    [AppErrorTypeEnum.DB_CANNOT_UPDATE]: {
        type: AppErrorTypeEnum.DB_CANNOT_UPDATE,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errorMessage: 'Cannot update selected entity.',
        userMessage: 'Cannot update selected entity.'
    },
    [AppErrorTypeEnum.DB_NOTHING_TO_UPDATE]: {
        type: AppErrorTypeEnum.DB_NOTHING_TO_UPDATE,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Nothing to update.',
        userMessage: 'Nothing to update, enter different data.'
    },
    [AppErrorTypeEnum.DB_CANNOT_CREATE]: {
        type: AppErrorTypeEnum.DB_CANNOT_CREATE,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Entity cannot to be created.',
        userMessage: 'Entity cannot to be created.'
    },
    [AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION]: {
        type: AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION,
        httpStatus: HttpStatus.NOT_ACCEPTABLE,
        errorMessage: 'Invalid credentials.',
        userMessage: 'Invalid credentials.'
    },
    [AppErrorTypeEnum.DB_INVALID_OBJECT_ID]: {
        type: AppErrorTypeEnum.DB_INVALID_OBJECT_ID,
        httpStatus: HttpStatus.NOT_ACCEPTABLE,
        errorMessage: 'Invalid ObjectId passed.',
        userMessage: 'Invalid ObjectId passed.'
    },
    [AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE]: {
        type: AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE,
        httpStatus: HttpStatus.BAD_REQUEST, // TODO change
        errorMessage: 'Cannot upload image.',
        userMessage: 'Cannot upload image.'
    },
    [AppErrorTypeEnum.DB_INVALID_RANGE]: {
        type: AppErrorTypeEnum.DB_INVALID_RANGE,
        httpStatus: HttpStatus.BAD_REQUEST, // TODO change
        errorMessage: 'Not in ranger.',
        userMessage: 'Selected range is invalid.'
    },
    [AppErrorTypeEnum.DB_INCORRECT_MODEL]: {
        type: AppErrorTypeEnum.DB_INCORRECT_MODEL,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Incorrenct db model passed.',
        userMessage: 'Cannot interact with database.'
    },
    [AppErrorTypeEnum.IMAGE_NOT_UPLOADED]: {
        type: AppErrorTypeEnum.IMAGE_NOT_UPLOADED,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Image not uploaded. Cannot proceed.',
        userMessage: 'Image not uploaded. Cannot proceed.'
    },
    [AppErrorTypeEnum.DB_CANNOT_DELETE]: {
        type: AppErrorTypeEnum.DB_CANNOT_DELETE,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errorMessage: 'Cannot delete selected entity.',
        userMessage: 'Cannot delete selected entity.'
    },
    [AppErrorTypeEnum.DB_DUPLICATE_KEY]: {
        type: AppErrorTypeEnum.DB_DUPLICATE_KEY,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errorMessage: 'Duplicate key.',
        userMessage: 'Duplicate key.'
    },
    [AppErrorTypeEnum.DB_VALIDATION_ERROR]: {
        type: AppErrorTypeEnum.DB_VALIDATION_ERROR,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Validation error.',
        userMessage: 'Validation error.'
    },
    [AppErrorTypeEnum.ROLE_ALREADY_PROVIDED]: {
        type: AppErrorTypeEnum.ROLE_ALREADY_PROVIDED,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Role already provided.',
        userMessage: 'Role already provided.'
    },
    [AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH]: {
        type: AppErrorTypeEnum.INSUFFICIENT_USER_PASSWORD_LENGTH,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Insufficient user password length.',
        userMessage: 'Insufficient user password length.'
    },
    [AppErrorTypeEnum.ROLE_NOT_PROVIDED]: {
        type: AppErrorTypeEnum.ROLE_NOT_PROVIDED,
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Role not provided.',
        userMessage: 'Role not provided.'
    }
}

interface AppErrorModificationOptions extends Pick<IErrorMessage, 'errorMessage' | 'userMessage'> {
    errorMessage: string
    userMessage: string
}

// TODO: move to enum

/***
 *
 * @constructor Create AppError with passed error code otherwise create "Bad Request"
 *
 */
export class AppError extends Error {
    public errorCode: AppErrorTypeEnum;
    public httpStatus: number;
    public errorMessage: string;
    public userMessage: string;

    constructor(errorCode?: AppErrorTypeEnum, options?: Partial<AppErrorModificationOptions>) {
        super();
        if (!errorCode) {
            this.name = "Bad Request";
            this.httpStatus = HttpStatus.BAD_REQUEST;
            this.errorCode = AppErrorTypeEnum.BAD_REQUEST;
            this.errorMessage = "Bad Request";
            this.userMessage = "Bad Request";
            return;
        }

        const error: IErrorMessage = errors[errorCode];
        if (options) {
            // @ts-ignore // TODO
            Object.keys(options).forEach(key => error[key] = options[key])
        }
        if (!error) throw new Error('Unable to find message code error.');
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.httpStatus = error.httpStatus;
        this.errorCode = errorCode;
        this.errorMessage = error.errorMessage;
        this.userMessage = error.userMessage;
    }
}
