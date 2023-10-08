import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose"
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { loadControllers } from "./middlewareRoute.ts"
const mongooseConnect: string = Deno.env.get("MONGOOSE_CONNECT_URI")
const PORT = 3000

async function init() {
    try {
        console.log("Connecting to database...")
        await initDatabase(mongooseConnect)
        console.log("Connected to database successfully.")

        console.log("Loading oak...")
        await initOakApp()
        console.log(`Oak loaded successfully, PORT: ${PORT}`)
    } catch (error) {
        console.log("error", error)
        Deno.exit()
    }
}

async function initDatabase(uri: string) {
    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
} 

function initOakApp():Promise<void>{
    return new Promise<void>((resolve) => {
        const app = new Application()
        const router = new Router()
        const middlewareOptions = {
            baseRoute: "/api",
            directory: "./src/routes",
            router
        }
        loadControllers(middlewareOptions)
        app.use(router.routes())
        app.use(router.allowedMethods())
        app.listen({port: PORT})
        resolve()
    })
} 

init()