import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {post, comment }= req.body;
        const body = JSON.stringify({
            post,
            comment
        });
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = process.env.NEXT_PUBLIC_SERVER_HTTP_HOST + `/comments/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = await APIRes.json();
            if (APIRes.status == 201) {    
                res.status(200).json(data);
            } else {
                res.status(APIRes.status).json({ error: 'Internal Server Error' });
            }
        } catch(err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
};