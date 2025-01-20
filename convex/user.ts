import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
    args: {
        userName: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        // check if user already exists
        const user = await ctx.db.query('users')
        .filter((q) => q.eq(q.field('email'), args.email)).collect();

        // if user does not exist
        if(user?.length == 0) {
            await ctx.db.insert('users', {
                userName: args.userName,
                email: args.email,
                imageUrl: args.imageUrl,
            });
            return 'Inserted New User!';
        }

        // if user alreadys exists
        return "User Already Exists!"
    }
});