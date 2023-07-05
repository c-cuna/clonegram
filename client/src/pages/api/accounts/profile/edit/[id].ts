import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    if (req.method === 'PUT') {
        const { username, email, first_name, last_name, profile }= req.body;
        const body = JSON.stringify({
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
            profile: {
                bio: profile.bio,
                location: profile.location,
            }
        });
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        if (!access) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        try {
            const url = API_BASE + `/accounts/user/update/` + id + '/';
            const APIRes = await fetch(url, {
                method: 'PUT',
                body: body,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${access}`
                },
                credentials: "include",
            })
            
            if (APIRes.status == 200) {
                const data = await APIRes.json();
                res.status(200).json(data);
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({ message: 'Internal Server Error' });
            }
        } catch(err) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};