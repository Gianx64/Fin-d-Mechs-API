//TODO: change for deployment
export default ({
    app: {
        port: 3000
    },
    jwt:{
        secret: 'secretnotefortokengeneration'
    },
    pg: {
        host: 'postgres',
        port: '5432',
        user: 'gian',
        password: 'pass',
        database: 'FindMechsDB',
        charset: 'utf8'
    }
})