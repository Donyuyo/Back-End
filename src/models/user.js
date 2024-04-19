import { Schema, model } from "mongoose";
import cartModel from './cart.js'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        default: "User"
    },
    cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.pre('save', async function (next) {
    try {
        const newCart = await cartModel.create({ products: [] })
        console.log(newCart)
        this.cart_id = newCart._id
    } catch (e) {
        next(e)
    }
})

userSchema.pre('find', async function (next) {
    try {
        const prods = await cartModel.findOne({ _id: '661739a0111773eba9eae766' })
        console.log(prods)
        this.populate('cart_id')
    } catch (e) {
        next(e)
    }
})


export const userModel = model("users", userSchema)