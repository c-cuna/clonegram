import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = API_BASE + `/notifications/count/`;
            const APIRes = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = await APIRes.json();

            if (APIRes.status === 200) {
                res.status(200).json(data);
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({
                    error: data.error
                });
            }
        } catch(err) {
            console.log(err)
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