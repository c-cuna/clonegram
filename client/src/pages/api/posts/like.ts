import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { post }= req.body;
        const body = JSON.stringify({
            post
        });
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = API_BASE + `/likes/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`
                }
            })
            
            if (APIRes.status == 201) {
                res.status(200).json({
                    message: 'Like successfully created'
                });
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({ message: 'Something went wrong when uploading' });
            }
        } catch(err) {
     
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};