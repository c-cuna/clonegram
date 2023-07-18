import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        console.log(cookies);
        if (!access) {
            return res.status(403).json({
                error: 'User forbidden from making the request'
            });
        }
        const body = JSON.stringify({
            token: access
        });

        try {
            const url = process.env.NEXT_PUBLIC_SERVER_HTTP_HOST + `/accounts/login/verify/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            if (APIRes.status === 200) {
                return res.status(200).json({ success: 'Authenticated successfully' });
            } else {

                return res.status(APIRes.status).json({ error: 'Failed to authenticate' });
            }
        } catch(err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
};