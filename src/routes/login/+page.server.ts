
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


export const actions = {
    login: async ({locals, request}) =>{
        const body = Object.fromEntries(await request.formData())
        console.log("body",body);
        
        try {
            await locals.pb.collection('users').authWithPassword(body.email, body.password)

        } catch (error) {
            console.log(error);
            console.error(error.response.data);
            return;
        }

        throw redirect(303, "/dashboard")
    }
}