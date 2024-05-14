import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../../../models/user.js";
import varenv from "../../../dotenv.js";
const cookieExtractor = req => {
    console.log(req.cookies)
    //{} no hay cookies != esta cookie no existe
    //Si existen cookies, asigno mi cookie en especifico
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

const jwtOptions = {
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) consultando desde las cookies
    secretOrKey: varenv.jwt_secret
}



export const strategyJWT = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        console.log(payload)
        const user = await userModel.findById(payload.user._id)
        console.log(user)
        if (!user) {
            return done(null, false)
        }
        return done(null, user)
    } catch (e) {
        return done(e, null)
    }
})