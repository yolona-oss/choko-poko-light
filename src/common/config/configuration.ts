import dotenv from 'dotenv'
import { DEFAULT_SERVICE_PORT } from '../constants';

if (process.env.NODE_ENV === 'prod') {
    dotenv.config({
        path: `${process.env.npm_config_local_prefix}/.${process.env.NODE_ENV}.env`
    })
} else {
    dotenv.config()
}

export interface ConfigSchema {
    port: number,
    database: {
        connection_string: string,
        name: string;
    },
    cloudinary: {
        resolve_name: string,
        api_key: string,
        api_secret: string,

    },
    jwt: {
        access_token: {
            secret: string,
            sign_options: {
                expires_in: string
            }
        },
        refresh_token: {
            secret: string,
            sign_options: {
                expires_in: string
            }
        }
    },
    static_data_storage: {
        cities_file: string
    },
    default_user: {
        name: string,
        email: string,
        phone: string,
        password: string
    }
}

export default (): ConfigSchema => ({
    port: parseInt(<any>process.env.PORT, 10) || DEFAULT_SERVICE_PORT,
    database: {
        connection_string: <string>process.env.DATABASE_CONNECTION_STRING,
        name: <string>process.env.DATABASE_NAME,
    },
    cloudinary: {
        resolve_name: <string>process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
        api_key: <string>process.env.CLOUDINARY_CONFIG_API_KEY,
        api_secret: <string>process.env.CLOUDINARY_CONFIG_API_SECRET
    },
    jwt: {
        access_token: {
            secret: <string>process.env.JWT_TOKEN_SECRET_KEY,
            sign_options: {
                expires_in: <string>process.env.JWT_TOKEN_OPTION_EXPIRES_IN
            },
        },
        refresh_token: {
            secret: <string>process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
            sign_options: {
                expires_in: <string>process.env.JWT_REFRESH_TOKEN_OPTION_EXPIRES_IN
            },
        }
    },
    static_data_storage: {
        cities_file: `${process.env.npm_config_local_prefix}/${process.env.DATABASE_CITIES_FILE}`
    },
    default_user: {
        name: <string>process.env.DEFAULT_USER_NAME,
        email: <string>process.env.DEFAULT_USER_EMAIL,
        phone: <string>process.env.DEFAULT_USER_PHONE,
        password: <string>process.env.DEFAULT_USER_PASSWORD
    }
})
