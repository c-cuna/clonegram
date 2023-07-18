import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


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
            const url = process.env.NEXT_PUBLIC_SERVER_HTTP_HOST + `/accounts/login/refresh/`;
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

                return res.status(200).json({
                    success: 'Refresh request successful'
                });
            } else {

                return res.status(APIRes.status).json({
                    error: 'Token Refresh Failed'
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json(
            { error: `Method ${req.method} not allowed` }
        )
    }
};