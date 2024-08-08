import dotenv from 'dotenv'

dotenv.config({
    path: `${process.env.npm_config_local_prefix}/.${process.env.NODE_ENV}.env`
})

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
        token: string,
        sign_options: {
            expires_in: string
        }
    },
    static_data_storage: {
        cities_file: string
    }
}

export default (): ConfigSchema => ({
    port: parseInt(<any>process.env.PORT, 10) || 3000,
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
        token: <string>process.env.JWT_SECRET_KEY,
        sign_options: {
            expires_in: <string>process.env.JWT_OPTION_EXPIRES_IN
        }
    },
    static_data_storage: {
        cities_file: `${process.env.npm_config_local_prefix}/${process.env.DATABASE_CITIES_FILE}`
    }
})
