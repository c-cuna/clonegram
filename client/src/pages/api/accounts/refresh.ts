import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE } from '../../../constants/constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const refresh = cookies.refresh ?? false;

        if (!refresh) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        const body = JSON.stringify({
            refresh
        });

        try {
            const url = API_BASE + `/accounts/login/refresh/`;
            const APIRes = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            const data = await APIRes.json();

            if (APIRes.status === 200) {
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', data.access, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV !== 'development',
                            maxAge: 60 * 60 * 24,
                            sameSite: 'strict',
                            path: '/api/'
                        }
                    )
                ]);

                res.status(200).json({
                    success: 'Refresh request successful'
                });
            } else {
                APIRes.text().then(text => {console.log(text)})
                res.status(APIRes.status).json({
                    error: 'Token Refresh Failed'
                });
            }
        } catch(err) {
            res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json(
            { error: `Method ${req.method} not allowed` }
        )
    }
};