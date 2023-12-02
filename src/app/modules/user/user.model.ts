import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";

const userSchema = new Schema<TUser>({
    id:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    needsPasswordChange:{
        type: Boolean,
        default: true
    },
    role:{
        type: String,
        enum: ['admin','student','faculty']
    },
    status:{
        type: String,
        enum: ['in-progress','blocked'],
        default: 'in-progress'
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

// middleware/hook
userSchema.pre('save', async function(next){
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_round));
    next()
  })
  
  
  userSchema.post('save', function (doc, next) {
    doc.password = '';
    next()
  })
  
  // query middleware/hook
  userSchema.pre('find', function(next){
    this.find({isDeleted: {$ne: true}});
    next()
  })
  userSchema.pre('findOne', function(next){
    this.findOne({isDeleted: {$ne: true}});
    next()
  })
  
  userSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {isDeleted: {$ne: true}}});
    next()
  })

export const User = model<TUser>('User',userSchema)