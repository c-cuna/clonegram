import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = process.env.NEXT_PUBLIC_API + `/notifications/get/` + id + '/';
            const APIRes = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = await APIRes.json();

            if (APIRes.status === 200) {
                return res.status(200).json(data);
            } else {

                return res.status(APIRes.status).json({
                    error: data.error
                });
            }
        } catch(err) {
            console.log(err)
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};