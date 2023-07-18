import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'DELETE') {
        const { post }= req.body;
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = process.env.NEXT_PUBLIC_SERVER_HTTP_HOST + `/likes/` + post + '/';
            const APIRes = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`
                }
            });


            if (APIRes.status == 204) {
                res.status(200).json({
                    message: 'Post successfully unliked'
                });
            } else {

                res.status(APIRes.status).json({
                    error: "Something went wrong"
                });
            }
        } catch(err) {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};