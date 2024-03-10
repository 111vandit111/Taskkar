import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";

const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!
);

const liveblocks = new Liveblocks({
    secret: "sk_dev_smwz6Vp8JMS2vjhySYLavvhzWhUt7du6OZU6P8oH7xa-ybjwNSWoI5b8xudz5xlQ",
});

export async function POST(request: Request) {
    const authorization = await auth();
    const user = await currentUser();

    console.log(authorization , user)

    if(!authorization || !user){
        return new Response(JSON.stringify({error: "Not authorized"}), { status: 401 });
    }
    const { room } = await request.json();
    const board = await convex.query(api.boards.get, {id: room})

    console.log(board , user )
    if(board?.orgId!=authorization.orgId) return new Response(JSON.stringify({error: "Not authorized"}), { status: 401 });

    const userInfo = {
        name : user.firstName+" "+user?.lastName,
        avatar : user.imageUrl,
    };

    const session = liveblocks.prepareSession(
        user.id,
        {userInfo}
    )

    console.log(session)
    if(room) session.allow(room, session.FULL_ACCESS);

    const { status , body } = await session.authorize();

    console.log(status , body)
    return new Response(body, { status });
}