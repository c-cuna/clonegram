import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            res.status(403).json({
                error: 'User forbidden from making the request'
            });
        }
        const body = JSON.stringify({
            token: access
        });

        try {
            const url = API_BASE + `/accounts/login/verify/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            if (APIRes.status === 200) {
                res.status(200).json({ success: 'Authenticated successfully' });
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({ error: 'Failed to authenticate' });
            }
        } catch(err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
};