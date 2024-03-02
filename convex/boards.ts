import { mutation } from './_generated/server';
import { v } from "convex/values";

const images = [
    "/iconsBg/1.svg",
    "/iconsBg/2.svg",
    "/iconsBg/3.svg",
    "/iconsBg/4.svg",
    "/iconsBg/5.svg",
    "/iconsBg/6.svg",
    "/iconsBg/7.svg",
    "/iconsBg/8.svg",
    "/iconsBg/9.svg",
    "/iconsBg/10.svg",
    "/iconsBg/11.svg",
    "/iconsBg/12.svg",
    "/iconsBg/13.svg",
    "/iconsBg/14.svg",
    "/iconsBg/15.svg",
    "/iconsBg/16.svg",
    "/iconsBg/17.svg",
    "/iconsBg/18.svg",
    "/iconsBg/19.svg",
    "/iconsBg/20.svg",
    "/iconsBg/21.svg",
    "/iconsBg/22.svg",
    "/iconsBg/23.svg",
    "/iconsBg/24.svg",
    "/iconsBg/25.svg",
]

export const create = mutation({
    args: {
        orgId: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authorized");
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];
        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage
        });

        return board;
    }
})

export const remove = mutation({
    args: {
        id: v.id("boards"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not Authorized");
        }

        await ctx.db.delete(args.id);

    }
})

export const update = mutation({
    args: {
        id: v.id("boards"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not Authorized");
        }
        const title = args.title.trim();

        if (!title) {
            throw new Error("Title cannot be empty");
        }

        if (title.length > 45) {
            throw new Error("Title cannot be longer than 100 characters");
        }

        const board = await ctx.db.patch(args.id, {
            title: args.title,
        })

        return board;
    }
});

export const favourite = mutation({
    args: {
        id: v.id("boards"),
        orgId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not Authorized");
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error("Board not found");
        }

        const userId = identity.subject;
        const userFavourite = await ctx.db.query("userFavourites")
            .withIndex("by_user_board_org", (q) => q.eq("userId",userId).eq("boardId", board._id).eq("orgId", args.orgId))
            .first();
        
        if (userFavourite) {
            throw new Error("Already favourited");
        }

        await ctx.db.insert("userFavourites", {
            boardId: board._id,
            orgId: board.orgId,
            userId: userId,
        })

        return board;
    }
})

export const unFavourite = mutation({
    args: {
        id: v.id("boards"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not Authorized");
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error("Board not found");
        }

        const userId = identity.subject;
        const userFavourite = await ctx.db.query("userFavourites")
            .withIndex("by_user_board", (q) => q.eq("userId", userId).eq("boardId", args.id))
            .unique();
        
        if (!userFavourite) {
            throw new Error("Already favourited");
        }

        await ctx.db.delete(userFavourite._id);  

        return board;
    }
})