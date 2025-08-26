import mongoose, {Document, Schema, Types} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    comparePassword(candidate: string): Promise<boolean>;
}

//User Mongoose Schema
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password:{ type: String, required: true, select: false},
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next){
    //Password wont be hashed when name is changed
    if(!this.isModified("password")){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
    catch(err: any){
        next(err);
    }
});

//Verify user Password
userSchema.methods.comparePassword = async function (candidate: string){
    return bcrypt.compare(candidate, this.password);
};

//Created a model named User
export const User = mongoose.model<IUser>("User",userSchema);