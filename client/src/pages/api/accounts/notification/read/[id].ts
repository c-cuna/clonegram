import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        const body = JSON.stringify({
            is_read: req.body.is_read
        });

        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = process.env.NEXT_PUBLIC_API + `/notifications/` + id + '/';
            const APIRes = await fetch(url, {
                method: 'PATCH',
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`
                }
            })
            
            if (APIRes.status == 200) {
                const data = await APIRes.json();
                return res.status(200).json(data);
            } else {

                return res.status(APIRes.status).json({ message: 'Internal Server Error' });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Internal Server Errror'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};