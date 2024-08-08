import { AppErrorTypeEnum } from './AppErrorTypeEnum';
import { IErrorMessage } from './IErrorMessage';
import { HttpStatus } from '@nestjs/common';

const errors: Record<AppErrorTypeEnum, IErrorMessage> = {
    [AppErrorTypeEnum.DB_ENTITY_EXISTS]: {
        type: AppErrorTypeEnum.DB_ENTITY_EXISTS,
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errorMessage: 'Entity exists',
        userMessage: 'Entity exists'
    },
    [AppErrorTypeEnum.DB_NO_ENTRIES]: {
        type: AppErrorTypeEnum.DB_NO_ENTRIES,
        httpStatus: HttpStatus.NOT_FOUND,
        errorMessage: 'No entries exits in the database',
        userMessage: 'No entries.'
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
    }
}

interface AppErrorModificationOptions extends Pick<IErrorMessage, 'errorMessage' | 'userMessage'> {
    errorMessage: string
    userMessage: string
}

export class AppError extends Error {
    public errorCode: AppErrorTypeEnum;
    public httpStatus: number;
    public errorMessage: string;
    public userMessage: string;

    constructor(errorCode: AppErrorTypeEnum, options?: Partial<AppErrorModificationOptions>) {
        super();
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
