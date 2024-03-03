import { v } from "convex/values";
import { query } from "./_generated/server";
import { favourite } from "./boards";
import { getAllOrThrow } from "convex-helpers/server/relationships";

export const get = query({
    args: {
        orgId : v.string(),
        serach: v.optional(v.string()),
        favourites : v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not Authorized");
        }

        if(args.favourites){
            const favouriteBoards = await ctx.db
            .query("userFavourites")
            .withIndex("by_user_org", (q) => q.eq("userId", identity.subject).eq("orgId", args.orgId))
            .order("desc")
            .collect();

            const ids = favouriteBoards.map((board) => board.boardId);

            const boards = await getAllOrThrow(ctx.db, ids);

            return boards.map((board) => ({
                    ...board,
                    favourite: true
            }))
        }

        const title = args.serach as string;

        var boards = [];

        if(args.serach) {
            boards = await ctx.db
            .query("boards")
            .withSearchIndex("search_title",
            (q) =>
            q.search("title",title)
            .eq("orgId", args.orgId)
            ).collect();
        }else{
            boards = await ctx.db
            .query("boards")
            .withIndex("by_org" , (q) => q.eq("orgId", args.orgId))
            .order("desc")
            .collect();
        }

        

        const boardsWithFavourite = boards.map((board) => {
            return ctx.db
            .query("userFavourites")
            .withIndex("by_user_board", (q)=> q.eq("userId",identity.subject).eq("boardId",board._id)).unique()
            .then((isFavourite) => {
               return { ...board,
                favourite: !!isFavourite,}
            })
        })

        const boardsWithFavouriteBoolean = Promise.all(boardsWithFavourite);

        return boardsWithFavouriteBoolean;
    }
})