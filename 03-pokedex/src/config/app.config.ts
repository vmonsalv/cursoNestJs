export const EnvConfiguration = () => ({
    envornment: process.env.NODE_ENV || 'dev',
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT || 3001,
    defaultLimit: process.env.DEFAULT_LIMIT || 7
})